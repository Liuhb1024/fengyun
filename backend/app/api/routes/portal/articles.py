from fastapi import APIRouter, HTTPException
from sqlalchemy import func, select

from app.api.deps import SessionDep
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Article
from app.schemas.article import ArticleOut

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="文章列表")
async def list_articles(
    session: SessionDep,
    page: int = 1,
    page_size: int = 10,
    category: str | None = None,
):
    base_stmt = select(Article).where(Article.is_published.is_(True))
    if category:
        base_stmt = base_stmt.where(Article.category == category)
    count_stmt = select(func.count()).select_from(base_stmt.subquery())
    total = (await session.execute(count_stmt)).scalar_one() or 0
    data_stmt = (
        base_stmt.order_by(Article.publish_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(data_stmt)
    items = [ArticleOut.model_validate(item).model_dump() for item in result.scalars().all()]
    return build_paginated_payload(items, total, page, page_size)


@router.get("/{article_id}", response_class=SuccessResponse, summary="文章详情")
async def article_detail(article_id: int, session: SessionDep):
    stmt = select(Article).where(Article.id == article_id, Article.is_published.is_(True))
    result = await session.execute(stmt)
    article = result.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    article.view_count += 1
    await session.commit()
    await session.refresh(article)
    return ArticleOut.model_validate(article).model_dump()
