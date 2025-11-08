from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import decode_token
from app.db import get_session
from app.db.models import Admin
from app.schemas.auth import TokenPayload
from app.services.token_blocklist import is_token_revoked

SessionDep = Annotated[AsyncSession, Depends(get_session)]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_prefix}/admin/auth/login")


async def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionDep,
) -> Admin:
    try:
        payload: TokenPayload = decode_token(token)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="认证失败") from exc

    if await is_token_revoked(payload.jti):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="令牌已失效")

    result = await session.execute(select(Admin).where(Admin.username == payload.sub))
    admin = result.scalar_one_or_none()
    if admin is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在")
    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="账户已禁用")
    return admin
