from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Video
from app.schemas.video import VideoCreate, VideoOut, VideoUpdate
from app.services.crud_entities import video_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="视频列表")
async def list_videos(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 12,
    category: str | None = None,
):
    items, total = await video_crud.get_multi(
        session,
        page=page,
        page_size=page_size,
        filters={"category": category},
        order_by=Video.created_at.desc(),
    )
    payload = build_paginated_payload(
        [VideoOut.model_validate(item) for item in items], total, page, page_size
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="新增视频")
async def create_video(
    payload: VideoCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await video_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="video", action="create", content=item.id)
    await session.commit()
    return VideoOut.model_validate(item).model_dump()


@router.put("/{video_id}", response_class=SuccessResponse, summary="更新视频")
async def update_video(
    video_id: int,
    payload: VideoUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await video_crud.get(session, video_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="视频不存在")
    item = await video_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="video", action="update", content=item.id)
    await session.commit()
    return VideoOut.model_validate(item).model_dump()


@router.delete("/{video_id}", response_class=SuccessResponse, summary="删除视频")
async def delete_video(
    video_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await video_crud.delete(session, video_id)
    await record_operation(session, admin_id=current_admin.id, module="video", action="delete", content=video_id)
    await session.commit()
    return {"message": "删除成功"}

