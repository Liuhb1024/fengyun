from datetime import datetime

from pydantic import BaseModel, Field

from .base import ORMModel


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=6, max_length=50)
    new_password: str = Field(..., min_length=6, max_length=50)


class TokenPayload(BaseModel):
    sub: str
    exp: int
    jti: str


class AdminProfile(ORMModel):
    id: int
    username: str
    nickname: str | None = None
    avatar: str | None = None
    role: str

