from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from app.api.deps import SessionDep
from app.core.responses import SuccessResponse
from app.db.models import SEOConfig
from app.schemas.seo import SEOConfigOut

router = APIRouter()


@router.get("/{page_key}", response_class=SuccessResponse, summary="页面SEO信息")
async def get_seo(page_key: str, session: SessionDep):
    stmt = select(SEOConfig).where(SEOConfig.page_key == page_key)
    result = await session.execute(stmt)
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="SEO信息不存在")
    return SEOConfigOut.model_validate(config).model_dump()

