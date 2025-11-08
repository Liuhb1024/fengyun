from datetime import date

from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class MemberBase(BaseModel):
    avatar: str | None = None
    name_zh: str
    name_en: str | None = None
    position_zh: str | None = None
    position_en: str | None = None
    bio_zh: str | None = None
    bio_en: str | None = None
    join_date: date | None = None
    sort_order: int = Field(0, ge=0)
    is_homepage: bool = False


class MemberCreate(MemberBase):
    pass


class MemberUpdate(BaseModel):
    avatar: str | None = None
    name_zh: str | None = None
    name_en: str | None = None
    position_zh: str | None = None
    position_en: str | None = None
    bio_zh: str | None = None
    bio_en: str | None = None
    join_date: date | None = None
    sort_order: int | None = Field(None, ge=0)
    is_homepage: bool | None = None


class MemberOut(MemberBase, Timestamped, ORMModel):
    id: int

