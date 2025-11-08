from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class CarouselBase(BaseModel):
    image_url: str
    title_zh: str | None = None
    title_en: str | None = None
    link_url: str | None = None
    sort_order: int = Field(0, ge=0)
    is_active: bool = True


class CarouselCreate(CarouselBase):
    image_url: str = Field(..., max_length=500)


class CarouselUpdate(CarouselBase):
    image_url: str | None = Field(None, max_length=500)


class CarouselOut(CarouselBase, Timestamped, ORMModel):
    id: int

