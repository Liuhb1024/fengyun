from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.db.models import Member
from app.schemas.member import MemberOut

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="成员列表")
async def list_members(session: SessionDep, homepage: bool | None = None):
    stmt = select(Member).order_by(Member.sort_order.desc())
    if homepage is not None:
        stmt = stmt.where(Member.is_homepage.is_(homepage))
    result = await session.execute(stmt)
    items = [MemberOut.model_validate(member).model_dump() for member in result.scalars().all()]
    return items

