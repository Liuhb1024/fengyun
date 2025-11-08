from fastapi import APIRouter, Request

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.db.models import VisitLog
from app.schemas.visit import VisitCreate

router = APIRouter()


@router.post("/visit", response_class=SuccessResponse, summary="记录访问")
async def record_visit(payload: VisitCreate, request: Request, session: SessionDep):
    visit = VisitLog(
        page_url=payload.page_url,
        referer=payload.referer,
        ip_address=request.client.host if request.client else None,
        user_agent=payload.user_agent,
        device_type=payload.device_type,
        browser=payload.browser,
        os=payload.os,
        region=payload.region,
    )
    session.add(visit)
    await session.commit()
    return {"message": "记录成功"}
