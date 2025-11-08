from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from .base import ORMModel


RoleLiteral = Literal["super_admin", "admin"]


class AdminUserCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)
    nickname: str | None = Field(default=None, max_length=50)
    avatar: str | None = Field(default=None, max_length=255)
    role: RoleLiteral = Field(default="admin")
    is_active: bool = True


class AdminUserUpdate(BaseModel):
    nickname: str | None = Field(default=None, max_length=50)
    avatar: str | None = Field(default=None, max_length=255)
    role: RoleLiteral | None = None
    is_active: bool | None = None
    password: str | None = Field(default=None, min_length=6, max_length=50)


class AdminResetPasswordRequest(BaseModel):
    new_password: str | None = Field(default=None, min_length=6, max_length=50)


class AdminResetPasswordResponse(BaseModel):
    password: str


class AdminUserOut(ORMModel):
    id: int
    username: str
    nickname: str | None = None
    avatar: str | None = None
    role: RoleLiteral
    is_active: bool
    last_login_at: datetime | None = None
    last_login_ip: str | None = None
    created_at: datetime
