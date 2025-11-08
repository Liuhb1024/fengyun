from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Carousel
from app.schemas.carousel import CarouselCreate, CarouselOut, CarouselUpdate
from app.services.crud_entities import carousel_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="轮播图列表")
async def list_carousels(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 10,
    is_active: bool | None = None,
):
    items, total = await carousel_crud.get_multi(
        session,
        page=page,
        page_size=page_size,
        filters={"is_active": is_active},
        order_by=Carousel.sort_order.desc(),
    )
    payload = build_paginated_payload(
        [CarouselOut.model_validate(item) for item in items], total, page, page_size
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="新增轮播图")
async def create_carousel(
    payload: CarouselCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await carousel_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="carousel", action="create", content=item.id)
    await session.commit()
    return CarouselOut.model_validate(item).model_dump()


@router.put("/{carousel_id}", response_class=SuccessResponse, summary="更新轮播图")
async def update_carousel(
    carousel_id: int,
    payload: CarouselUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await carousel_crud.get(session, carousel_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="轮播图不存在")
    item = await carousel_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="carousel", action="update", content=item.id)
    await session.commit()
    return CarouselOut.model_validate(item).model_dump()


@router.delete("/{carousel_id}", response_class=SuccessResponse, summary="删除轮播图")
async def delete_carousel(
    carousel_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await carousel_crud.delete(session, carousel_id)
    await record_operation(session, admin_id=current_admin.id, module="carousel", action="delete", content=carousel_id)
    await session.commit()
    return {"message": "删除成功"}

