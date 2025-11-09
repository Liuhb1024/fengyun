from fastapi import APIRouter

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.schemas.contact import ContactInfo
from app.services.system_config import get_config_value

router = APIRouter()


@router.get("", response_class=SuccessResponse, summary="门户联系我们信息")
async def contact_info(session: SessionDep):
    data = await get_config_value(session, "contact_info", default=ContactInfo().model_dump())
    return ContactInfo.model_validate(data).model_dump()
