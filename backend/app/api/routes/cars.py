from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import require_admin
from app.db.session import get_db
from app.models.car import Car
from app.schemas.car import CarCreate, CarListResponse, CarResponse, CarUpdate


router = APIRouter()
MAX_IMAGE_SIZE = 10 * 1024 * 1024
IMAGE_SIGNATURES = {
    ".jpg": ("image/jpeg", lambda content: content.startswith(b"\xff\xd8\xff")),
    ".jpeg": ("image/jpeg", lambda content: content.startswith(b"\xff\xd8\xff")),
    ".png": ("image/png", lambda content: content.startswith(b"\x89PNG\r\n\x1a\n")),
    ".webp": ("image/webp", lambda content: content.startswith(b"RIFF") and content[8:12] == b"WEBP"),
    ".gif": ("image/gif", lambda content: content.startswith((b"GIF87a", b"GIF89a"))),
}


def _not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")


@router.get("", response_model=CarListResponse)
def list_cars(
    db: Session = Depends(get_db),
    search: str | None = Query(default=None, max_length=100),
    car_type: str | None = Query(default=None, alias="type"),
    status_filter: str | None = Query(default=None, alias="status"),
    featured: bool | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=24, ge=1, le=100),
) -> CarListResponse:
    statement = select(Car)
    count_statement = select(func.count()).select_from(Car)
    filters = []
    if search:
        term = f"%{search.strip()}%"
        filters.append(or_(Car.name.ilike(term), Car.model.ilike(term), Car.location.ilike(term)))
    if car_type:
        filters.append(Car.type == car_type)
    if status_filter:
        filters.append(Car.status == status_filter)
    if featured is not None:
        filters.append(Car.is_featured == featured)
    statement = statement.where(*filters).order_by(Car.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    total = db.scalar(count_statement.where(*filters)) or 0
    return CarListResponse(items=db.scalars(statement).all(), total=total, page=page, pageSize=page_size)


@router.post("/images", dependencies=[Depends(require_admin)])
async def upload_car_image(request: Request) -> dict[str, str]:
    content_type = request.headers.get("content-type", "").lower()
    image_type = next((value for value in IMAGE_SIGNATURES.values() if value[0] == content_type), None)
    if image_type is None:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Unsupported image format")

    content = bytearray()
    async for chunk in request.stream():
        if len(content) + len(chunk) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image must be 10 MB or smaller")
        content.extend(chunk)
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image file is empty")
    content = bytes(content)
    if not image_type[1](content):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Image content does not match its file type")

    settings.upload_directory.mkdir(parents=True, exist_ok=True)
    extension = next(extension for extension, value in IMAGE_SIGNATURES.items() if value == image_type)
    filename = f"{uuid4().hex}{extension}"
    (settings.upload_directory / filename).write_bytes(content)
    return {"image": f"/uploads/{filename}"}


@router.get("/{car_id}", response_model=CarResponse)
def get_car(car_id: int, db: Session = Depends(get_db)) -> Car:
    car = db.get(Car, car_id)
    if car is None:
        raise _not_found()
    return car


@router.post("", response_model=CarResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_car(payload: CarCreate, db: Session = Depends(get_db)) -> Car:
    car = Car(**payload.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


@router.patch("/{car_id}", response_model=CarResponse, dependencies=[Depends(require_admin)])
def update_car(car_id: int, payload: CarUpdate, db: Session = Depends(get_db)) -> Car:
    car = db.get(Car, car_id)
    if car is None:
        raise _not_found()
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(car, field, value)
    db.commit()
    db.refresh(car)
    return car


@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_car(car_id: int, db: Session = Depends(get_db)) -> None:
    car = db.get(Car, car_id)
    if car is None:
        raise _not_found()
    db.delete(car)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a car with existing test-drive requests",
        ) from exc