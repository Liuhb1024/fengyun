from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, Image
from app.schemas.image import ImageCreate, ImageOut, ImageUpdate
from app.services.crud_entities import image_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="图片列表")
async def list_images(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 12,
    category: str | None = None,
    is_homepage: bool | None = None,
):
    filters = {"category": category, "is_homepage": is_homepage, "is_deleted": False}
    items, total = await image_crud.get_multi(
        session, page=page, page_size=page_size, filters=filters, order_by=Image.created_at.desc()
    )
    payload = build_paginated_payload(
        [ImageOut.model_validate(item) for item in items], total, page, page_size
    )
    return payload


@router.post("", response_class=SuccessResponse, summary="新增图片")
async def create_image(
    payload: ImageCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await image_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="image", action="create", content=item.id)
    await session.commit()
    return ImageOut.model_validate(item).model_dump()


@router.put("/{image_id}", response_class=SuccessResponse, summary="更新图片")
async def update_image(
    image_id: int,
    payload: ImageUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await image_crud.get(session, image_id)
    if not db_obj or db_obj.is_deleted:
        raise HTTPException(status_code=404, detail="图片不存在")
    item = await image_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="image", action="update", content=item.id)
    await session.commit()
    return ImageOut.model_validate(item).model_dump()


@router.delete("/{image_id}", response_class=SuccessResponse, summary="删除图片")
async def delete_image(
    image_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await image_crud.get(session, image_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="图片不存在")
    db_obj.is_deleted = True
    await record_operation(session, admin_id=current_admin.id, module="image", action="delete", content=image_id)
    await session.commit()
    return {"message": "删除成功"}

