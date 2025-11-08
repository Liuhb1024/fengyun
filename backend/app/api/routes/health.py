"""Health and readiness endpoints."""

from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings
from app.core.responses import SuccessResponse

router = APIRouter()


@router.get("/healthz", response_class=SuccessResponse, summary="存活检测")
async def health_check() -> dict[str, object]:
    """Return basic metadata for monitoring."""
    return {
        "status": "ok",
        "service": settings.project_name,
        "environment": settings.env,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

