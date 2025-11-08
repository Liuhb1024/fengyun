from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.api.deps import SessionDep, get_current_admin
from app.core.responses import SuccessResponse
from app.db.models import Admin, Article, Image, Video
from app.schemas.stats import ContentHotItem
from app.services.stats import get_overview_stats, get_visit_stats

router = APIRouter()


@router.get("/overview", response_class=SuccessResponse, summary="概要统计")
async def overview(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    return await get_overview_stats(session)


@router.get("/visits", response_class=SuccessResponse, summary="访问统计")
async def visit_stats(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    days: int = 7,
):
    total_pv, total_uv, data = await get_visit_stats(session, days=days)
    return {"total_pv": total_pv, "total_uv": total_uv, "data": data}


@router.get("/content-hot", response_class=SuccessResponse, summary="热门内容")
async def content_hot(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    type: str = "article",
    limit: int = 10,
):
    mapping = {
        "article": (Article, Article.title_zh, Article.view_count),
        "image": (Image, Image.title_zh, Image.view_count),
        "video": (Video, Video.title_zh, Video.play_count),
    }
    if type not in mapping:
        raise HTTPException(status_code=400, detail="type 参数错误")
    model, title_column, metric_column = mapping[type]
    stmt = select(model.id, title_column.label("title"), metric_column.label("metric")).order_by(
        metric_column.desc()
    ).limit(limit)
    result = await session.execute(stmt)
    items = [
        ContentHotItem(id=row.id, title=row.title or "未命名", metric=row.metric or 0).model_dump()
        for row in result.fetchall()
    ]
    return items

