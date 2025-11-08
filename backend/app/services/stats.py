from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Article, Image, Member, Video, VisitLog


async def get_overview_stats(session: AsyncSession) -> dict[str, int]:
    counts = {}
    for model, key in [
        (Article, "total_articles"),
        (Image, "total_images"),
        (Video, "total_videos"),
        (Member, "total_members"),
    ]:
        result = await session.execute(select(func.count()).select_from(model))
        counts[key] = result.scalar_one() or 0
    visit_result = await session.execute(select(func.count()).select_from(VisitLog))
    counts["total_visits"] = visit_result.scalar_one() or 0
    return counts


async def get_visit_stats(session: AsyncSession, days: int = 7) -> tuple[int, int, list[dict[str, int]]]:
    start_date = date.today() - timedelta(days=days - 1)
    stmt = (
        select(
            func.date(VisitLog.created_at).label("day"),
            func.count().label("pv"),
            func.count(func.distinct(VisitLog.ip_address)).label("uv"),
        )
        .where(VisitLog.created_at >= start_date)
        .group_by("day")
        .order_by("day")
    )
    result = await session.execute(stmt)
    data = [
        {"date": row.day, "pv": int(row.pv or 0), "uv": int(row.uv or 0)}
        for row in result.fetchall()
    ]
    total_pv = sum(item["pv"] for item in data)
    total_uv = sum(item["uv"] for item in data)
    return total_pv, total_uv, data

