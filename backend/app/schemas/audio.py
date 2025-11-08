from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class AudioBase(BaseModel):
    url: str
    cover_url: str | None = None
    title_zh: str
    title_en: str | None = None
    category: str | None = None
    duration: int = Field(0, ge=0)


class AudioCreate(AudioBase):
    url: str = Field(..., max_length=500)


class AudioUpdate(BaseModel):
    url: str | None = Field(None, max_length=500)
    cover_url: str | None = None
    title_zh: str | None = None
    title_en: str | None = None
    category: str | None = None
    duration: int | None = Field(None, ge=0)


class AudioOut(AudioBase, Timestamped, ORMModel):
    id: int
    play_count: int

