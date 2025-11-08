from datetime import date

from pydantic import BaseModel


class OverviewStats(BaseModel):
    total_articles: int
    total_images: int
    total_videos: int
    total_members: int
    total_visits: int


class VisitDataPoint(BaseModel):
    date: date
    pv: int
    uv: int


class VisitStatsResponse(BaseModel):
    total_pv: int
    total_uv: int
    data: list[VisitDataPoint]


class ContentHotItem(BaseModel):
    id: int
    title: str
    metric: int

