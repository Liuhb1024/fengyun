from datetime import datetime

from pydantic import BaseModel

from .base import ORMModel


class OperationLogOut(ORMModel):
    id: int
    admin_id: int
    module: str
    action: str
    content: str | None = None
    ip_address: str | None = None
    created_at: datetime

