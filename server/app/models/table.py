from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Table(Base):
    __tablename__ = "tables"

    id: Mapped[int] = mapped_column(primary_key=True)
    cafe_id: Mapped[int] = mapped_column(ForeignKey("cafes.id"))
    table_number: Mapped[str] = mapped_column(String(10))
    capacity: Mapped[int] = mapped_column(Integer)
