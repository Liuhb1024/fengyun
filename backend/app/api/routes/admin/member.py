from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Member
from app.schemas.member import MemberCreate, MemberOut, MemberUpdate
from app.services.crud_entities import member_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="成员列表")
async def list_members(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 20,
):
    items, total = await member_crud.get_multi(
        session,
        page=page,
        page_size=page_size,
        filters={},
        order_by=Member.sort_order.desc(),
    )
    payload = build_paginated_payload(
        [MemberOut.model_validate(item) for item in items], total, page, page_size
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="新增成员")
async def create_member(
    payload: MemberCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await member_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="member", action="create", content=item.id)
    await session.commit()
    return MemberOut.model_validate(item).model_dump()


@router.put("/{member_id}", response_class=SuccessResponse, summary="更新成员")
async def update_member(
    member_id: int,
    payload: MemberUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await member_crud.get(session, member_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="成员不存在")
    item = await member_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="member", action="update", content=item.id)
    await session.commit()
    return MemberOut.model_validate(item).model_dump()


@router.delete("/{member_id}", response_class=SuccessResponse, summary="删除成员")
async def delete_member(
    member_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await member_crud.delete(session, member_id)
    await record_operation(session, admin_id=current_admin.id, module="member", action="delete", content=member_id)
    await session.commit()
    return {"message": "删除成功"}

