from datetime import time
from sqlalchemy import String, Text, Time, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Cafe(Base):
    __tablename__ = "cafes"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    address: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cuisine: Mapped[str | None] = mapped_column(String(100), nullable=True)
    price_range: Mapped[str | None] = mapped_column(String(10), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    opening_time: Mapped[time] = mapped_column(Time)
    closing_time: Mapped[time] = mapped_column(Time)

    status: Mapped[str] = mapped_column(String(20), default="pending", server_default="pending")
