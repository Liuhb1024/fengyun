"""Redis client helper (optional)."""

from __future__ import annotations

from typing import Optional

from redis.asyncio import Redis, from_url

from app.core.config import settings

redis_client: Optional[Redis] = None

if settings.redis_url:
    redis_client = from_url(settings.redis_url, decode_responses=True)

