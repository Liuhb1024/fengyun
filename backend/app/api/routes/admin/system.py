from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import SessionDep, get_current_admin
from app.core.responses import SuccessResponse
from app.db.models import Admin
from app.schemas.system_config import SystemConfigOut, SystemConfigUpdate
from app.services.crud_entities import system_config_crud
from app.services.operation_log import record_operation
from app.services.system_config import get_config_value, set_config_value

router = APIRouter()


@router.get("/config", response_class=SuccessResponse, summary="系统配置列表")
async def list_configs(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    items, _ = await system_config_crud.get_multi(session, page=1, page_size=999, filters={})
    return [SystemConfigOut.model_validate(item).model_dump() for item in items]


@router.get("/config/{config_key}", response_class=SuccessResponse, summary="获取配置")
async def get_config(
    config_key: str,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    value = await get_config_value(session, config_key)
    if value is None:
        raise HTTPException(status_code=404, detail="配置不存在")
    return {"config_key": config_key, "config_value": value}


@router.put("/config/{config_key}", response_class=SuccessResponse, summary="更新配置")
async def update_config(
    config_key: str,
    payload: SystemConfigUpdate,
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
):
    config_value = payload.config_value if payload.config_value is not None else ""
    config = await set_config_value(session, config_key, config_value, description=payload.description)
    await record_operation(
        session, admin_id=current_admin.id, module="system", action="update_config", content=config_key
    )
    await session.commit()
    return SystemConfigOut.model_validate(config).model_dump()

