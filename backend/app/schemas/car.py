from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CarBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    model: str | None = Field(default=None, max_length=120)
    year: int = Field(ge=1886, le=2100)
    type: str = Field(min_length=1, max_length=30)
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    cost_basis: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="costBasis")
    sold_price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="soldPrice")
    pending_amount: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2, alias="pendingAmount")
    mileage: int = Field(default=0, ge=0)
    fuel: str = Field(default="Petrol", max_length=30)
    transmission: str = Field(default="Automatic", max_length=30)
    rating: Decimal | None = Field(default=None, ge=0, le=5, max_digits=2, decimal_places=1)
    location: str = Field(default="Veloce showroom", max_length=120)
    image: HttpUrl | str
    description: str | None = None
    accent: str | None = Field(default=None, max_length=30)
    status: str = Field(default="Available", pattern="^(Available|Reserved|Sold)$")
    is_featured: bool = Field(default=False, alias="isFeatured")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class CarCreate(CarBase):
    pass


class CarUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    model: str | None = Field(default=None, max_length=120)
    year: int | None = Field(default=None, ge=1886, le=2100)
    type: str | None = Field(default=None, min_length=1, max_length=30)
    price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    cost_basis: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="costBasis")
    sold_price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="soldPrice")
    pending_amount: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2, alias="pendingAmount")
    mileage: int | None = Field(default=None, ge=0)
    fuel: str | None = Field(default=None, max_length=30)
    transmission: str | None = Field(default=None, max_length=30)
    rating: Decimal | None = Field(default=None, ge=0, le=5, max_digits=2, decimal_places=1)
    location: str | None = Field(default=None, max_length=120)
    image: HttpUrl | str | None = None
    description: str | None = None
    accent: str | None = Field(default=None, max_length=30)
    status: str | None = Field(default=None, pattern="^(Available|Reserved|Sold)$")
    is_featured: bool | None = Field(default=None, alias="isFeatured")

    model_config = ConfigDict(populate_by_name=True)


class CarResponse(CarBase):
    id: int


class CarListResponse(BaseModel):
    items: list[CarResponse]
    total: int
    page: int
    page_size: int = Field(alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)