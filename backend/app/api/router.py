"""Root API router that aggregates all sub-routes."""

from fastapi import APIRouter

from app.core.config import settings

from .routes import health
from .routes.admin import router as admin_router
from .routes.portal import router as portal_router

api_router = APIRouter(prefix=settings.api_prefix)

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(admin_router)
api_router.include_router(portal_router)
