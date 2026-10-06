from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CarImageBase(BaseModel):
    url: str = Field(max_length=500)
    is_primary: bool = Field(default=False, alias="isPrimary")
    display_order: int = Field(default=0, alias="displayOrder")
    caption: str | None = Field(default=None, max_length=150)

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class CarImageCreate(CarImageBase):
    pass


class CarImageResponse(CarImageBase):
    id: int
    car_id: int = Field(alias="carId")


class CarDocumentBase(BaseModel):
    file_url: str = Field(max_length=500, alias="fileUrl")
    file_name: str = Field(max_length=255, alias="fileName")
    file_type: str = Field(default="Document", max_length=50, alias="fileType")
    file_size: int | None = Field(default=None, alias="fileSize")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class CarDocumentCreate(CarDocumentBase):
    pass


class CarDocumentResponse(CarDocumentBase):
    id: int
    car_id: int = Field(alias="carId")


class CarBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    model: str | None = Field(default=None, max_length=120)
    submodel: str | None = Field(default=None, max_length=120)
    year: int = Field(ge=1886, le=2100)
    type: str = Field(min_length=1, max_length=30)
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    currency: str = Field(default="USD", pattern="^(USD|GBP)$")
    cost_basis: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="costBasis")
    sold_price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="soldPrice")
    pending_amount: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2, alias="pendingAmount")
    mileage: int = Field(default=0, ge=0)
    fuel: str = Field(default="Petrol", max_length=30)
    transmission: str = Field(default="Automatic", max_length=30)
    location: str = Field(default="DriveXCars showroom", max_length=120)
    image: HttpUrl | str
    description: str | None = None
    accent: str | None = Field(default=None, max_length=30)
    status: str = Field(default="Available", pattern="^(Available|Reserved|Sold)$")
    is_featured: bool = Field(default=False, alias="isFeatured")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class CarCreate(CarBase):
    images: list[CarImageCreate] = Field(default_factory=list)
    documents: list[CarDocumentCreate] = Field(default_factory=list)


class CarUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=80)
    model: str | None = Field(default=None, max_length=120)
    submodel: str | None = Field(default=None, max_length=120)
    year: int | None = Field(default=None, ge=1886, le=2100)
    type: str | None = Field(default=None, min_length=1, max_length=30)
    price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    currency: str | None = Field(default=None, pattern="^(USD|GBP)$")
    cost_basis: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="costBasis")
    sold_price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2, alias="soldPrice")
    pending_amount: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2, alias="pendingAmount")
    mileage: int | None = Field(default=None, ge=0)
    fuel: str | None = Field(default=None, max_length=30)
    transmission: str | None = Field(default=None, max_length=30)
    location: str | None = Field(default=None, max_length=120)
    image: HttpUrl | str | None = None
    description: str | None = None
    accent: str | None = Field(default=None, max_length=30)
    status: str | None = Field(default=None, pattern="^(Available|Reserved|Sold)$")
    is_featured: bool | None = Field(default=None, alias="isFeatured")

    model_config = ConfigDict(populate_by_name=True)


class CarResponse(CarBase):
    id: int
    images: list[CarImageResponse] = Field(default_factory=list)
    documents: list[CarDocumentResponse] = Field(default_factory=list)


class CarListResponse(BaseModel):
    items: list[CarResponse]
    total: int
    page: int
    page_size: int = Field(alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)