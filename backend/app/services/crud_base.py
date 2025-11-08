from typing import Any, Generic, Optional, Sequence, TypeVar

from pydantic import BaseModel
from sqlalchemy import Select, delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Generic CRUD helper for SQLAlchemy models."""

    def __init__(self, model: type[ModelType]) -> None:
        self.model = model

    def _base_query(self) -> Select:
        return select(self.model)

    async def get(self, session: AsyncSession, item_id: int) -> Optional[ModelType]:
        result = await session.execute(self._base_query().where(self.model.id == item_id))  # type: ignore[attr-defined]
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        session: AsyncSession,
        *,
        page: int = 1,
        page_size: int = 10,
        filters: dict[str, Any] | None = None,
        order_by: InstrumentedAttribute | None = None,
    ) -> tuple[Sequence[ModelType], int]:
        stmt = self._base_query()
        if filters:
            for column, value in filters.items():
                if value is None:
                    continue
                field = getattr(self.model, column, None)
                if field is not None:
                    stmt = stmt.where(field == value)
        total_stmt = select(func.count()).select_from(stmt.subquery())
        total_result = await session.execute(total_stmt)
        total = total_result.scalar_one() or 0
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        result = await session.execute(stmt)
        return result.scalars().all(), total

    async def create(self, session: AsyncSession, obj_in: CreateSchemaType) -> ModelType:
        data = obj_in.model_dump(exclude_unset=True)
        db_obj = self.model(**data)
        session.add(db_obj)  # type: ignore[arg-type]
        await session.flush()
        await session.refresh(db_obj)
        return db_obj

    async def update(
        self, session: AsyncSession, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, Any]
    ) -> ModelType:
        data = obj_in if isinstance(obj_in, dict) else obj_in.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(db_obj, field, value)
        session.add(db_obj)  # type: ignore[arg-type]
        await session.flush()
        await session.refresh(db_obj)
        return db_obj

    async def delete(self, session: AsyncSession, item_id: int) -> None:
        stmt = delete(self.model).where(self.model.id == item_id)  # type: ignore[attr-defined]
        await session.execute(stmt)
