from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import OperationLog


async def record_operation(
    session: AsyncSession, *, admin_id: int, module: str, action: str, content: Any = None, ip: str | None = None
) -> None:
    log = OperationLog(
        admin_id=admin_id,
        module=module,
        action=action,
        content=None if content is None else str(content),
        ip_address=ip,
    )
    session.add(log)
    await session.flush()

