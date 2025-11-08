from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Audio
from app.schemas.audio import AudioCreate, AudioOut, AudioUpdate
from app.services.crud_entities import audio_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="音频列表")
async def list_audios(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 12,
    category: str | None = None,
):
    items, total = await audio_crud.get_multi(
        session,
        page=page,
        page_size=page_size,
        filters={"category": category},
        order_by=Audio.created_at.desc(),
    )
    payload = build_paginated_payload(
        [AudioOut.model_validate(item) for item in items], total, page, page_size
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="新增音频")
async def create_audio(
    payload: AudioCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await audio_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="audio", action="create", content=item.id)
    await session.commit()
    return AudioOut.model_validate(item).model_dump()


@router.put("/{audio_id}", response_class=SuccessResponse, summary="更新音频")
async def update_audio(
    audio_id: int,
    payload: AudioUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await audio_crud.get(session, audio_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="音频不存在")
    item = await audio_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="audio", action="update", content=item.id)
    await session.commit()
    return AudioOut.model_validate(item).model_dump()


@router.delete("/{audio_id}", response_class=SuccessResponse, summary="删除音频")
async def delete_audio(
    audio_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await audio_crud.delete(session, audio_id)
    await record_operation(session, admin_id=current_admin.id, module="audio", action="delete", content=audio_id)
    await session.commit()
    return {"message": "删除成功"}

