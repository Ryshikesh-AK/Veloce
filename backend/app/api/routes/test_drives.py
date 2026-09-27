from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.car import Car
from app.models.test_drive import TestDrive
from app.schemas.test_drive import TestDriveCreate, TestDriveResponse, TestDriveStatusUpdate


router = APIRouter()


def _response(request: TestDrive, car: Car) -> TestDriveResponse:
    return TestDriveResponse(
        id=request.id, carId=car.id, carName=f"{car.name}{f' {car.model}' if car.model else ''}",
        carImage=car.image, customerName=request.customer_name, customerEmail=request.customer_email,
        customerPhone=request.customer_phone, preferredAt=request.preferred_at,
        approvedAt=request.approved_at, reviewedAt=request.reviewed_at, status=request.status,
        createdAt=request.created_at,
    )


def _get_request(db: Session, request_id: int) -> tuple[TestDrive, Car]:
    row = db.execute(
        select(TestDrive, Car).join(Car, Car.id == TestDrive.car_id).where(TestDrive.id == request_id)
    ).one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test-drive request not found")
    return row


@router.post("", response_model=TestDriveResponse, status_code=status.HTTP_201_CREATED)
def create_test_drive(payload: TestDriveCreate, db: Session = Depends(get_db)) -> TestDriveResponse:
    car = db.get(Car, payload.car_id)
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    if car.status != "Available":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Car is not available for test drives")
    request = TestDrive(**payload.model_dump())
    request.customer_email = request.customer_email.lower()
    db.add(request)
    db.commit()
    db.refresh(request)
    return _response(request, car)


@router.get("", response_model=list[TestDriveResponse])
def list_test_drives(
    email: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
) -> list[TestDriveResponse]:
    statement = select(TestDrive, Car).join(Car, Car.id == TestDrive.car_id).order_by(TestDrive.created_at.asc())
    if email:
        statement = statement.where(TestDrive.customer_email == email.lower())
    return [_response(request, car) for request, car in db.execute(statement).all()]


@router.get("/mine", response_model=list[TestDriveResponse])
def list_my_test_drives(email: str = Query(min_length=3), db: Session = Depends(get_db)) -> list[TestDriveResponse]:
    statement = select(TestDrive, Car).join(Car, Car.id == TestDrive.car_id).where(TestDrive.customer_email == email.lower()).order_by(TestDrive.created_at.desc())
    return [_response(request, car) for request, car in db.execute(statement).all()]


@router.patch("/{request_id}", response_model=TestDriveResponse, dependencies=[Depends(require_admin)])
def review_test_drive(request_id: int, payload: TestDriveStatusUpdate, db: Session = Depends(get_db)) -> TestDriveResponse:
    request, car = _get_request(db, request_id)
    if payload.status == "approved" and payload.approved_at is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="approvedAt is required")
    request.status = payload.status
    request.approved_at = payload.approved_at if payload.status == "approved" else None
    request.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(request)
    return _response(request, car)