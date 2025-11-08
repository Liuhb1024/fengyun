from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class SEOConfig(Base, TimestampMixin):
    __tablename__ = "seo_config"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page_key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title_zh: Mapped[str | None] = mapped_column(String(200))
    title_en: Mapped[str | None] = mapped_column(String(200))
    description_zh: Mapped[str | None] = mapped_column(String(500))
    description_en: Mapped[str | None] = mapped_column(String(500))
    keywords_zh: Mapped[str | None] = mapped_column(String(200))
    keywords_en: Mapped[str | None] = mapped_column(String(200))
    og_image: Mapped[str | None] = mapped_column(String(500))

