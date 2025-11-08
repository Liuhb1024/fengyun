from fastapi import APIRouter, HTTPException
from sqlalchemy import func, select

from app.api.deps import SessionDep
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Image
from app.schemas.image import ImageOut

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="图片列表")
async def list_images(
    session: SessionDep,
    page: int = 1,
    page_size: int = 12,
    category: str | None = None,
):
    base_stmt = select(Image).where(Image.is_deleted.is_(False))
    if category:
        base_stmt = base_stmt.where(Image.category == category)
    count_stmt = select(func.count()).select_from(base_stmt.subquery())
    total = (await session.execute(count_stmt)).scalar_one() or 0
    data_stmt = (
        base_stmt.order_by(Image.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(data_stmt)
    items = [ImageOut.model_validate(item).model_dump() for item in result.scalars().all()]
    return build_paginated_payload(items, total, page, page_size)


@router.get("/{image_id}", response_class=SuccessResponse, summary="图片详情")
async def image_detail(image_id: int, session: SessionDep):
    stmt = select(Image).where(Image.id == image_id, Image.is_deleted.is_(False))
    result = await session.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="图片不存在")
    item.view_count += 1
    await session.commit()
    await session.refresh(item)
    return ImageOut.model_validate(item).model_dump()
