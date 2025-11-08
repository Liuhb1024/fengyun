"""Token blocklist using Redis if available, otherwise in-memory fallback."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict

from app.core.redis import redis_client

_memory_blocklist: Dict[str, datetime] = {}


async def revoke_token(jti: str, expires_at: datetime) -> None:
    ttl = int((expires_at - datetime.now(timezone.utc)).total_seconds())
    ttl = max(ttl, 1)
    if redis_client:
        await redis_client.setex(f"token:blacklist:{jti}", ttl, "1")
    else:
        _memory_blocklist[jti] = expires_at


async def is_token_revoked(jti: str) -> bool:
    if redis_client:
        return await redis_client.exists(f"token:blacklist:{jti}") == 1
    expired = [key for key, exp in _memory_blocklist.items() if exp < datetime.now(timezone.utc)]
    for key in expired:
        _memory_blocklist.pop(key, None)
    return jti in _memory_blocklist

