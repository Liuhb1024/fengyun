from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.responses import SuccessResponse
from app.db.models import Admin
from app.schemas.seo import SEOConfigCreate, SEOConfigOut, SEOConfigUpdate
from app.services.crud_entities import seo_crud
from app.services.operation_log import record_operation

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="SEO配置列表")
async def list_seo_configs(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    items, _ = await seo_crud.get_multi(session, page=1, page_size=999, filters={})
    return [SEOConfigOut.model_validate(item).model_dump() for item in items]


@router.post("", response_class=SuccessResponse, summary="新增SEO配置")
async def create_seo_config(
    payload: SEOConfigCreate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    item = await seo_crud.create(session, payload)
    await record_operation(session, admin_id=current_admin.id, module="seo", action="create", content=item.id)
    await session.commit()
    return SEOConfigOut.model_validate(item).model_dump()


@router.put("/{seo_id}", response_class=SuccessResponse, summary="更新SEO配置")
async def update_seo_config(
    seo_id: int,
    payload: SEOConfigUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    db_obj = await seo_crud.get(session, seo_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="配置不存在")
    item = await seo_crud.update(session, db_obj, payload)
    await record_operation(session, admin_id=current_admin.id, module="seo", action="update", content=item.id)
    await session.commit()
    return SEOConfigOut.model_validate(item).model_dump()


@router.delete("/{seo_id}", response_class=SuccessResponse, summary="删除SEO配置")
async def delete_seo_config(
    seo_id: int,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    await seo_crud.delete(session, seo_id)
    await record_operation(session, admin_id=current_admin.id, module="seo", action="delete", content=seo_id)
    await session.commit()
    return {"message": "删除成功"}

