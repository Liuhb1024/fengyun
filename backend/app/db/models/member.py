from datetime import date

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class Member(Base, TimestampMixin):
    __tablename__ = "member"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    avatar: Mapped[str | None] = mapped_column(String(500))
    name_zh: Mapped[str] = mapped_column(String(50), nullable=False)
    name_en: Mapped[str | None] = mapped_column(String(100))
    position_zh: Mapped[str | None] = mapped_column(String(50))
    position_en: Mapped[str | None] = mapped_column(String(100))
    bio_zh: Mapped[str | None] = mapped_column(Text)
    bio_en: Mapped[str | None] = mapped_column(Text)
    join_date: Mapped[date | None] = mapped_column()
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_homepage: Mapped[bool] = mapped_column(default=False)

