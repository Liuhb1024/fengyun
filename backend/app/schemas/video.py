from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class VideoBase(BaseModel):
    url: str
    cover_url: str | None = None
    title_zh: str
    title_en: str | None = None
    description_zh: str | None = None
    description_en: str | None = None
    category: str | None = None
    duration: int = Field(0, ge=0)
    file_size: int = Field(0, ge=0)


class VideoCreate(VideoBase):
    url: str = Field(..., max_length=500)


class VideoUpdate(BaseModel):
    url: str | None = Field(None, max_length=500)
    cover_url: str | None = None
    title_zh: str | None = None
    title_en: str | None = None
    description_zh: str | None = None
    description_en: str | None = None
    category: str | None = None
    duration: int | None = Field(None, ge=0)
    file_size: int | None = Field(None, ge=0)


class VideoOut(VideoBase, Timestamped, ORMModel):
    id: int
    play_count: int

