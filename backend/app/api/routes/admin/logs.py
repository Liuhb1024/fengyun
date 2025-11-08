from fastapi import APIRouter, Depends
from sqlalchemy import func, select

from app.api.deps import SessionDep, get_current_admin
from app.core.pagination import build_paginated_payload
from app.core.responses import SuccessResponse
from app.db.models import Admin, OperationLog
from app.schemas.operation_log import OperationLogOut

router = APIRouter()


@router.get("/operations", response_class=SuccessResponse, summary="操作日志列表")
async def list_operation_logs(
    session: SessionDep,
    current_admin: Admin = Depends(get_current_admin),
    page: int = 1,
    page_size: int = 20,
):
    stmt = (
        select(OperationLog)
        .order_by(OperationLog.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    items = result.scalars().all()
    count_stmt = select(func.count()).select_from(OperationLog)
    total = (await session.execute(count_stmt)).scalar_one() or 0
    payload = build_paginated_payload(
        [OperationLogOut.model_validate(item) for item in items],
        total,
        page,
        page_size,
    )
    return payload

