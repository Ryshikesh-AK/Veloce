from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), default="Guest Buyer")
    phone: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(320), nullable=True, index=True)
    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    car_id: Mapped[Optional[int]] = mapped_column(ForeignKey("cars.id", ondelete="CASCADE"), nullable=True)
    action_type: Mapped[str] = mapped_column(String(40), default="wishlist")
    status: Mapped[str] = mapped_column(String(30), default="Pending Call")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    contacted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())