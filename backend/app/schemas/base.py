from datetime import datetime
from typing import Generic, Sequence, TypeVar

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    meta: PaginationMeta
    items: Sequence[T]


class Timestamped(ORMModel):
    created_at: datetime
    updated_at: datetime
