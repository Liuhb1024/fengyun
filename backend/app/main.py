"""FastAPI application entrypoint."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logger import configure_logging
from app.core.middleware import register_middlewares


def create_app() -> FastAPI:
    configure_logging()

    app = FastAPI(
        title=settings.project_name,
        debug=settings.debug,
        docs_url=settings.docs_url,
        openapi_url=settings.openapi_url,
        version="0.1.0",
    )

    register_middlewares(app)
    register_exception_handlers(app)

    app.include_router(api_router)

    static_dir = Path(__file__).resolve().parent / "storage"
    static_dir.mkdir(parents=True, exist_ok=True)
    app.mount("/static/uploads", StaticFiles(directory=static_dir), name="uploads")

    return app


app = create_app()
