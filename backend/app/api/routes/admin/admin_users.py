import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.core.security import get_password_hash
from app.db.models import Admin
from app.schemas.admin_user import (
    AdminResetPasswordRequest,
    AdminResetPasswordResponse,
    AdminUserCreate,
    AdminUserOut,
    AdminUserUpdate,
)
from app.services.operation_log import record_operation

router = APIRouter()


def generate_temp_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def ensure_super_admin(admin: Admin) -> None:
    if admin.role != "super_admin":
        raise HTTPException(status_code=403, detail="仅超级管理员可以执行此操作")


async def ensure_other_super_admin(
    session: AsyncSession,
    target: Admin,
    *,
    will_disable: bool,
    will_demote: bool,
) -> None:
    if target.role != "super_admin":
        return
    if not (will_disable or will_demote):
        return
    stmt = select(func.count()).select_from(Admin).where(
        Admin.role == "super_admin",
        Admin.is_active.is_(True),
        Admin.id != target.id,
    )
    remaining = await session.scalar(stmt)
    if not remaining:
        raise HTTPException(status_code=400, detail="至少保留一名有效的超级管理员")


@router.get("", response_class=SuccessResponse, summary="管理员列表")
async def list_admin_users(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 20,
    keyword: str | None = None,
):
    ensure_super_admin(current_admin)
    page = 1 if page < 1 else page
    page_size = max(1, min(page_size, 100))
    conditions = []
    if keyword:
        like_pattern = f"%{keyword}%"
        conditions.append(or_(Admin.username.ilike(like_pattern), Admin.nickname.ilike(like_pattern)))

    count_stmt = select(func.count(Admin.id))
    data_stmt = select(Admin)
    if conditions:
        count_stmt = count_stmt.where(*conditions)
        data_stmt = data_stmt.where(*conditions)

    total = await session.scalar(count_stmt) or 0
    stmt = (
        data_stmt.order_by(Admin.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    items = [AdminUserOut.model_validate(admin).model_dump() for admin in result.scalars().all()]
    return build_paginated_payload(items, total, page, page_size)


@router.post("", response_class=SuccessResponse, summary="新增管理员")
async def create_admin_user(
    payload: AdminUserCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    ensure_super_admin(current_admin)
    exists_stmt = select(func.count()).select_from(Admin).where(Admin.username == payload.username)
    exists = await session.scalar(exists_stmt)
    if exists:
        raise HTTPException(status_code=400, detail="用户名已存在")

    admin = Admin(
        username=payload.username,
        password_hash=get_password_hash(payload.password),
        nickname=payload.nickname,
        avatar=payload.avatar,
        role=payload.role,
        is_active=payload.is_active,
    )
    session.add(admin)
    await session.flush()
    await record_operation(session, admin_id=current_admin.id, module="admin_user", action="create", content=admin.id)
    await session.commit()
    await session.refresh(admin)
    return AdminUserOut.model_validate(admin).model_dump()


@router.put("/{admin_id}", response_class=SuccessResponse, summary="更新管理员")
async def update_admin_user(
    admin_id: int,
    payload: AdminUserUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    ensure_super_admin(current_admin)
    admin = await session.get(Admin, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="管理员不存在")

    will_disable = payload.is_active is not None and payload.is_active is False
    will_demote = payload.role is not None and payload.role != "super_admin"
    await ensure_other_super_admin(session, admin, will_disable=will_disable, will_demote=will_demote)

    if payload.nickname is not None:
        admin.nickname = payload.nickname
    if payload.avatar is not None:
        admin.avatar = payload.avatar
    if payload.role is not None:
        admin.role = payload.role
    if payload.is_active is not None:
        admin.is_active = payload.is_active
    if payload.password:
        admin.password_hash = get_password_hash(payload.password)

    await record_operation(session, admin_id=current_admin.id, module="admin_user", action="update", content=admin.id)
    await session.commit()
    await session.refresh(admin)
    return AdminUserOut.model_validate(admin).model_dump()


@router.post("/{admin_id}/reset-password", response_class=SuccessResponse, summary="重置管理员密码")
async def reset_admin_password(
    admin_id: int,
    session: SessionDep,
    payload: AdminResetPasswordRequest | None = None,
    current_admin: Admin = Depends(get_current_admin),
):
    ensure_super_admin(current_admin)
    admin = await session.get(Admin, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="管理员不存在")

    plain_password = payload.new_password if payload and payload.new_password else generate_temp_password()
    admin.password_hash = get_password_hash(plain_password)

    await record_operation(session, admin_id=current_admin.id, module="admin_user", action="reset_password", content=admin.id)
    await session.commit()
    return AdminResetPasswordResponse(password=plain_password).model_dump()
