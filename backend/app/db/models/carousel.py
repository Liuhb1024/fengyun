from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class Carousel(Base, TimestampMixin):
    __tablename__ = "carousel"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    title_zh: Mapped[str | None] = mapped_column(String(100))
    title_en: Mapped[str | None] = mapped_column(String(100))
    link_url: Mapped[str | None] = mapped_column(String(500))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

