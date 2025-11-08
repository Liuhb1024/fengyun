"""Custom exceptions and FastAPI handlers."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette import status

from app.core.logger import logger


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


async def _handle_app_exception(request: Request, exc: AppException) -> JSONResponse:
    logger.warning("AppException: %s %s", request.url.path, exc.message)
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.status_code, "message": exc.message, "data": None},
    )


async def _handle_unexpected_exception(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception for %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"code": 500, "message": "内部服务器错误", "data": None},
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppException, _handle_app_exception)
    app.add_exception_handler(Exception, _handle_unexpected_exception)
