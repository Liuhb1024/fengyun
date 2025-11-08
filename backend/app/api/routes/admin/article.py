from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Article
from app.schemas.article import ArticleCreate, ArticleOut, ArticleUpdate
from app.services.crud_entities import article_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="文章列表")
async def list_articles(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 10,
    category: str | None = None,
    is_published: bool | None = None,
):
    filters = {"category": category, "is_published": is_published}
    items, total = await article_crud.get_multi(
        session,
        page=page,
        page_size=page_size,
        filters=filters,
        order_by=Article.publish_at.desc(),
    )
    payload = build_paginated_payload(
        [ArticleOut.model_validate(item) for item in items], total, page, page_size
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="创建文章")
async def create_article(
    payload: ArticleCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await article_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="article", action="create", content=item.id)
    await session.commit()
    return ArticleOut.model_validate(item).model_dump()


@router.get("/{article_id}", response_class=SuccessResponse, summary="文章详情")
async def get_article(
    article_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await article_crud.get(session, article_id)
    if not item:
        raise HTTPException(status_code=404, detail="文章不存在")
    return ArticleOut.model_validate(item).model_dump()


@router.put("/{article_id}", response_class=SuccessResponse, summary="更新文章")
async def update_article(
    article_id: int,
    payload: ArticleUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await article_crud.get(session, article_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="文章不存在")
    item = await article_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="article", action="update", content=item.id)
    await session.commit()
    return ArticleOut.model_validate(item).model_dump()


@router.delete("/{article_id}", response_class=SuccessResponse, summary="删除文章")
async def delete_article(
    article_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await article_crud.delete(session, article_id)
    await record_operation(session, admin_id=current_admin.id, module="article", action="delete", content=article_id)
    await session.commit()
    return {"message": "删除成功"}


@router.post("/{article_id}/publish", response_class=SuccessResponse, summary="发布文章")
async def publish_article(
    article_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await article_crud.get(session, article_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="文章不存在")
    db_obj.is_published = True
    await record_operation(session, admin_id=current_admin.id, module="article", action="publish", content=article_id)
    await session.commit()
    return {"message": "已发布"}

