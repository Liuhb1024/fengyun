from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.db.models import Article, Carousel, Navigation
from app.schemas.article import ArticleOut
from app.schemas.carousel import CarouselOut
from app.services.system_config import get_config_value

router = APIRouter()


@router.get("/home/config", response_class=SuccessResponse, summary="首页配置")
async def home_config(session: SessionDep):
    hero = await get_config_value(
        session,
        "home_hero",
        default={
            "video_url": "",
            "title_zh": "潮汕英歌舞",
            "title_en": "Chaoshan Yingge Dance",
            "subtitle_zh": "匠心传承 · 非遗风采",
            "subtitle_en": "Heritage in Motion",
            "cta_text_zh": "了解更多",
            "cta_text_en": "Learn More",
            "cta_link": "/culture",
        },
    )
    stats = await get_config_value(
        session,
        "home_stats",
        default={"founded_year": 1990, "members": 50, "performances": 200},
    )
    carousels_result = await session.execute(
        select(Carousel).where(Carousel.is_active.is_(True)).order_by(Carousel.sort_order.desc())
    )
    carousels = [
        CarouselOut.model_validate(item).model_dump() for item in carousels_result.scalars().all()
    ]
    nav_result = await session.execute(
        select(Navigation)
        .where(Navigation.parent_id == 0, Navigation.is_visible.is_(True))
        .order_by(Navigation.sort_order.asc())
    )
    quick_nav = [
        {"id": nav.id, "name": nav.name_zh, "link_url": nav.link_url, "is_external": nav.is_external}
        for nav in nav_result.scalars().all()
    ]
    return {"hero": hero, "carousels": carousels, "quick_nav": quick_nav, "stats": stats}


@router.get("/home/latest-news", response_class=SuccessResponse, summary="最新资讯")
async def latest_news(session: SessionDep, limit: int = 5):
    stmt = (
        select(Article)
        .where(Article.is_published.is_(True))
        .order_by(Article.publish_at.desc())
        .limit(limit)
    )
    result = await session.execute(stmt)
    items = [ArticleOut.model_validate(article).model_dump() for article in result.scalars().all()]
    return items

