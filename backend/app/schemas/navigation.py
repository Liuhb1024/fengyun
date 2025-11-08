from __future__ import annotations

from pydantic import BaseModel, Field

from .base import ORMModel, Timestamped


class NavigationBase(BaseModel):
    name_zh: str
    name_en: str | None = None
    link_url: str
    parent_id: int = Field(0, ge=0)
    sort_order: int = Field(0, ge=0)
    is_visible: bool = True
    is_external: bool = False


class NavigationCreate(NavigationBase):
    pass


class NavigationUpdate(BaseModel):
    name_zh: str | None = None
    name_en: str | None = None
    link_url: str | None = None
    parent_id: int | None = Field(None, ge=0)
    sort_order: int | None = Field(None, ge=0)
    is_visible: bool | None = None
    is_external: bool | None = None


class NavigationOut(NavigationBase, Timestamped, ORMModel):
    id: int


class NavigationTree(NavigationOut):
    children: list["NavigationTree"] = Field(default_factory=list)
