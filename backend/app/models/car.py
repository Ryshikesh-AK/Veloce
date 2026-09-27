from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Car(Base):
    __tablename__ = "cars"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), index=True)
    model: Mapped[str | None] = mapped_column(String(120), nullable=True)
    year: Mapped[int] = mapped_column(index=True)
    type: Mapped[str] = mapped_column(String(30), index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    cost_basis: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    sold_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    pending_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    mileage: Mapped[int] = mapped_column(default=0)
    fuel: Mapped[str] = mapped_column(String(30), default="Petrol")
    transmission: Mapped[str] = mapped_column(String(30), default="Automatic")
    rating: Mapped[Decimal | None] = mapped_column(Numeric(2, 1), nullable=True)
    location: Mapped[str] = mapped_column(String(120), default="Veloce showroom")
    image: Mapped[str] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    accent: Mapped[str | None] = mapped_column(String(30), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Available", index=True)
    is_featured: Mapped[bool] = mapped_column(default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )