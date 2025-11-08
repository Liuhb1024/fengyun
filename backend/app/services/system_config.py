import json
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import SystemConfig


async def get_config_value(session: AsyncSession, key: str, default: Any = None) -> Any:
    result = await session.execute(select(SystemConfig).where(SystemConfig.config_key == key))
    config = result.scalar_one_or_none()
    if not config or config.config_value is None:
        return default
    try:
        return json.loads(config.config_value)
    except json.JSONDecodeError:
        return config.config_value


async def set_config_value(session: AsyncSession, key: str, value: Any, description: str | None = None) -> SystemConfig:
    result = await session.execute(select(SystemConfig).where(SystemConfig.config_key == key))
    config = result.scalar_one_or_none()
    str_value = json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else str(value)
    if config is None:
        config = SystemConfig(config_key=key, config_value=str_value, description=description)
        session.add(config)
    else:
        config.config_value = str_value
        if description is not None:
            config.description = description
    await session.flush()
    return config

