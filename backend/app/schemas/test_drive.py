from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TestDriveCreate(BaseModel):
    car_id: int = Field(alias="carId")
    customer_name: str = Field(min_length=1, max_length=120, alias="customerName")
    customer_email: EmailStr = Field(alias="customerEmail")
    customer_phone: str | None = Field(default=None, max_length=40, alias="customerPhone")
    preferred_at: datetime = Field(alias="preferredAt")

    model_config = ConfigDict(populate_by_name=True)


class TestDriveStatusUpdate(BaseModel):
    status: str = Field(pattern="^(approved|declined)$")
    approved_at: datetime | None = Field(default=None, alias="approvedAt")

    model_config = ConfigDict(populate_by_name=True)


class TestDriveResponse(BaseModel):
    id: int
    car_id: int = Field(alias="carId")
    car_name: str = Field(alias="carName")
    car_image: str = Field(alias="carImage")
    customer_name: str = Field(alias="customerName")
    customer_email: EmailStr = Field(alias="customerEmail")
    customer_phone: str | None = Field(alias="customerPhone")
    preferred_at: datetime = Field(alias="preferredAt")
    approved_at: datetime | None = Field(alias="approvedAt")
    reviewed_at: datetime | None = Field(alias="reviewedAt")
    status: str
    created_at: datetime = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True)