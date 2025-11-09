from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, MilestoneEvent
from app.schemas.milestone import MilestoneCreate, MilestoneOut, MilestoneUpdate
from app.services.crud_entities import milestone_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="里程碑列表")
async def list_milestones(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 10,
):
    items, total = await milestone_crud.get_multi(
        session,
        page=page,
        page_size=page_size,
        order_by=MilestoneEvent.sort_order.desc(),
    )
    payload = build_paginated_payload(
        [MilestoneOut.model_validate(item) for item in items],
        total,
        page,
        page_size,
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="新增里程碑")
async def create_milestone(
    payload: MilestoneCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await milestone_crud.create(session, payload)
    await record_operation(
        session,
        admin_id=current_admin.id,
        module="milestone",
        action="create",
        content=item.title,
    )
    await session.commit()
    return MilestoneOut.model_validate(item).model_dump()


@router.put("/{milestone_id}", response_class=SuccessResponse, summary="更新里程碑")
async def update_milestone(
    milestone_id: int,
    payload: MilestoneUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await milestone_crud.get(session, milestone_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="里程碑不存在")
    item = await milestone_crud.update(session, db_obj, payload)
    await record_operation(
        session,
        admin_id=current_admin.id,
        module="milestone",
        action="update",
        content=item.title,
    )
    await session.commit()
    return MilestoneOut.model_validate(item).model_dump()


@router.delete("/{milestone_id}", response_class=SuccessResponse, summary="删除里程碑")
async def delete_milestone(
    milestone_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await milestone_crud.delete(session, milestone_id)
    await record_operation(
        session,
        admin_id=current_admin.id,
        module="milestone",
        action="delete",
        content=str(milestone_id),
    )
    await session.commit()
    return {"message": "删除成功"}
