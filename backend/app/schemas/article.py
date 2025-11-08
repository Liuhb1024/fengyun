from datetime import datetime

from pydantic import BaseModel, Field

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
    seo_keywords: str | None = None
    publish_at: datetime | None = None
    is_published: bool = False


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
    seo_keywords: str | None = None
    publish_at: datetime | None = None
    is_published: bool | None = None


class ArticleOut(ArticleBase, Timestamped, ORMModel):
    id: int
    view_count: int

