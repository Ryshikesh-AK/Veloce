from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Car(Base):
    __tablename__ = "cars"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), index=True)
    model: Mapped[str | None] = mapped_column(String(120), nullable=True)
    submodel: Mapped[str | None] = mapped_column(String(120), nullable=True)
    year: Mapped[int] = mapped_column(index=True)
    type: Mapped[str] = mapped_column(String(30), index=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="USD", server_default="USD")
    cost_basis: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    sold_price: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    pending_amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    mileage: Mapped[int] = mapped_column(default=0)
    fuel: Mapped[str] = mapped_column(String(30), default="Petrol")
    transmission: Mapped[str] = mapped_column(String(30), default="Automatic")
    location: Mapped[str] = mapped_column(String(120), default="DriveXCars showroom")
    image: Mapped[str] = mapped_column(String(500))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    accent: Mapped[str | None] = mapped_column(String(30), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Available", index=True)
    is_featured: Mapped[bool] = mapped_column(default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    images: Mapped[list["CarImage"]] = relationship(
        "CarImage", back_populates="car", cascade="all, delete-orphan", order_by="CarImage.display_order"
    )
    documents: Mapped[list["CarDocument"]] = relationship(
        "CarDocument", back_populates="car", cascade="all, delete-orphan"
    )


class CarImage(Base):
    __tablename__ = "car_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(500))
    is_primary: Mapped[bool] = mapped_column(default=False)
    display_order: Mapped[int] = mapped_column(default=0)
    caption: Mapped[str | None] = mapped_column(String(150), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    car: Mapped["Car"] = relationship("Car", back_populates="images")


class CarDocument(Base):
    __tablename__ = "car_documents"

    id: Mapped[int] = mapped_column(primary_key=True)
    car_id: Mapped[int] = mapped_column(ForeignKey("cars.id", ondelete="CASCADE"), index=True)
    file_url: Mapped[str] = mapped_column(String(500))
    file_name: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str] = mapped_column(String(50), default="Document")
    file_size: Mapped[int | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    car: Mapped["Car"] = relationship("Car", back_populates="documents")