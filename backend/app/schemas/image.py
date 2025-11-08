from datetime import date

from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class ImageBase(BaseModel):
    url: str
    thumbnail_url: str | None = None
    title_zh: str | None = None
    title_en: str | None = None
    description_zh: str | None = None
    description_en: str | None = None
    category: str | None = None
    shot_date: date | None = None
    is_homepage: bool = False


class ImageCreate(ImageBase):
    url: str = Field(..., max_length=500)


class ImageUpdate(BaseModel):
    url: str | None = Field(None, max_length=500)
    thumbnail_url: str | None = None
    title_zh: str | None = None
    title_en: str | None = None
    description_zh: str | None = None
    description_en: str | None = None
    category: str | None = None
    shot_date: date | None = None
    is_homepage: bool | None = None


class ImageOut(ImageBase, Timestamped, ORMModel):
    id: int
    view_count: int
    is_deleted: bool

