from pydantic import BaseModel

from .base import ORMModel, Timestamped


class SEOConfigBase(BaseModel):
    page_key: str
    title_zh: str | None = None
    title_en: str | None = None
    description_zh: str | None = None
    description_en: str | None = None
    keywords_zh: str | None = None
    keywords_en: str | None = None
    og_image: str | None = None


class SEOConfigCreate(SEOConfigBase):
    pass


class SEOConfigUpdate(BaseModel):
    title_zh: str | None = None
    title_en: str | None = None
    description_zh: str | None = None
    description_en: str | None = None
    keywords_zh: str | None = None
    keywords_en: str | None = None
    og_image: str | None = None


class SEOConfigOut(SEOConfigBase, Timestamped, ORMModel):
    id: int

