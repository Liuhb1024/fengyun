from datetime import date

from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class MilestoneBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str | None = None
    event_date: date
    location: str | None = Field(default=None, max_length=200)
    highlight: bool = False
    sort_order: int = 0
    category: str | None = Field(default=None, max_length=100)
    cover_url: str | None = Field(default=None, max_length=500)


class MilestoneCreate(MilestoneBase):
    pass


class MilestoneUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    description: str | None = None
    event_date: date | None = None
    location: str | None = Field(default=None, max_length=200)
    highlight: bool | None = None
    sort_order: int | None = None
    category: str | None = Field(default=None, max_length=100)
    cover_url: str | None = Field(default=None, max_length=500)


class MilestoneOut(MilestoneBase, Timestamped, ORMModel):
    id: int
