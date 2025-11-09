from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.db.models import MilestoneEvent
from app.schemas.milestone import MilestoneOut

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="门户里程碑列表")
async def list_milestones(session: SessionDep, limit: int | None = None):
    stmt = (
        select(MilestoneEvent)
        .order_by(MilestoneEvent.highlight.desc(), MilestoneEvent.sort_order.desc(), MilestoneEvent.event_date.desc())
    )
    if limit:
        stmt = stmt.limit(limit)
    result = await session.execute(stmt)
    items = [MilestoneOut.model_validate(item).model_dump() for item in result.scalars().all()]
    return items
