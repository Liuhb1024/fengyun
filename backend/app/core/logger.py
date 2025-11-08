"""Centralized loguru logger configuration."""

from __future__ import annotations

import sys
from typing import Any

from loguru import logger

from .config import settings


def configure_logging() -> None:
    """Configure loguru sinks once during startup."""
    logger.remove()
    logger.add(
        sys.stdout,
        level=settings.log_level.upper(),
        enqueue=True,
        colorize=True,
        backtrace=settings.debug,
        diagnose=settings.debug,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
            "<level>{message}</level>"
        ),
    )


def bind_context(**kwargs: Any) -> None:
    """Attach contextual information to subsequent log lines."""
    logger.bind(**kwargs)


__all__ = ["logger", "configure_logging", "bind_context"]

