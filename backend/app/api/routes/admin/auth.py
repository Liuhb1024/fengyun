from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select

from app.api.deps import SessionDep, get_current_admin, oauth2_scheme
from app.core.responses import SuccessResponse
from app.core.security import create_access_token, decode_token, get_password_hash, verify_password
from app.db.models import Admin
from app.schemas.auth import AdminProfile, ChangePasswordRequest, LoginRequest, TokenSchema
from app.services.operation_log import record_operation
from app.services.token_blocklist import revoke_token

router = APIRouter()


@router.post("/login", response_class=SuccessResponse, summary="Admin Login")
async def login(
    payload: LoginRequest,
    request: Request,
    session: SessionDep,
) -> dict[str, object]:
    stmt = select(Admin).where(Admin.username == payload.username)
    result = await session.execute(stmt)
    admin = result.scalar_one_or_none()
    if admin is None or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")
    token, expires_at, jti = create_access_token(admin.username)
    admin.last_login_at = datetime.now()
    admin.last_login_ip = request.client.host if request.client else None
    await session.flush()
    await record_operation(
        session,
        admin_id=admin.id,
        module="auth",
        action="login",
        content="admin login",
        ip=admin.last_login_ip,
    )
    await session.commit()
    profile = AdminProfile.model_validate(admin)
    return {
        "token": TokenSchema(access_token=token, expires_at=expires_at).model_dump(),
        "profile": profile.model_dump(),
        "jti": jti,
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me", response_class=SuccessResponse, summary="Current Admin")
async def get_me(current_admin: Admin = Depends(get_current_admin)) -> dict[str, object]:
    return AdminProfile.model_validate(current_admin).model_dump()


@router.post("/change-password", response_class=SuccessResponse, summary="Change Password")
async def change_password(
    payload: ChangePasswordRequest,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, str]:
    if not verify_password(payload.old_password, current_admin.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="原密码不正确")
    current_admin.password_hash = get_password_hash(payload.new_password)
    await session.flush()
    await record_operation(
        session,
        admin_id=current_admin.id,
        module="auth",
        action="change_password",
        content="change password",
    )
    await session.commit()
    return {"message": "密码修改成功"}


@router.post("/logout", response_class=SuccessResponse, summary="Logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    current_admin: Admin = Depends(get_current_admin),
) -> dict[str, str]:
    payload = decode_token(token)
    expires_at = datetime.fromtimestamp(payload.exp, tz=timezone.utc)
    await revoke_token(payload.jti, expires_at)
    return {"message": f"{current_admin.username} logged out"}
