from fastapi import APIRouter, HTTPException
from sqlalchemy import func, select

from app.api.deps import SessionDep
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Video
from app.schemas.video import VideoOut

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="视频列表")
async def list_videos(
    session: SessionDep,
    page: int = 1,
    page_size: int = 12,
    category: str | None = None,
):
    base_stmt = select(Video)
    if category:
        base_stmt = base_stmt.where(Video.category == category)
    count_stmt = select(func.count()).select_from(base_stmt.subquery())
    total = (await session.execute(count_stmt)).scalar_one() or 0
    data_stmt = (
        base_stmt.order_by(Video.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(data_stmt)
    items = [VideoOut.model_validate(video).model_dump() for video in result.scalars().all()]
    return build_paginated_payload(items, total, page, page_size)


@router.get("/{video_id}", response_class=SuccessResponse, summary="视频详情")
async def video_detail(video_id: int, session: SessionDep):
    stmt = select(Video).where(Video.id == video_id)
    result = await session.execute(stmt)
    video = result.scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=404, detail="视频不存在")
    video.play_count += 1
    await session.commit()
    await session.refresh(video)
    return VideoOut.model_validate(video).model_dump()
