from pydantic import BaseModel

from .base import ORMModel, Timestamped


class SystemConfigBase(BaseModel):
    config_key: str
    config_value: str | None = None
    description: str | None = None


class SystemConfigCreate(SystemConfigBase):
    pass


class SystemConfigUpdate(BaseModel):
    config_value: str | None = None
    description: str | None = None


class SystemConfigOut(SystemConfigBase, Timestamped, ORMModel):
    id: int

