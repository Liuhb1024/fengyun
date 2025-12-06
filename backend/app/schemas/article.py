from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from .base import ORMModel, Timestamped


class ArticleBase(BaseModel):
    title_zh: str
    title_en: str | None = None
    content_zh: str
    content_en: str | None = None
    cover_url: str | None = None
    summary_zh: str | None = None
    summary_en: str | None = None
    category: str | None = None
    tags: list[str] = Field(default_factory=list)
    content_format: Literal["html", "markdown"] = "html"
    seo_keywords: str | None = None
    publish_at: datetime | None = None
    is_published: bool = False

    @field_validator("tags", mode="before")
    @classmethod
    def ensure_tags_list(cls, value: list[str] | None):
        if value is None:
            return []
        if isinstance(value, list):
            return [tag for tag in value if tag]
        return value


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title_zh: str | None = None
    title_en: str | None = None
    content_zh: str | None = None
    content_en: str | None = None
    cover_url: str | None = None
    summary_zh: str | None = None
    summary_en: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    content_format: Literal["html", "markdown"] | None = None
    seo_keywords: str | None = None
    publish_at: datetime | None = None
    is_published: bool | None = None


class ArticleOut(ArticleBase, Timestamped, ORMModel):
    id: int
    view_count: int
