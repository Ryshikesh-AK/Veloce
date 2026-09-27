from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.car import Car
from app.services.catalog import DEFAULT_CARS


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.scalar(select(Car.id).limit(1)) is None:
            db.add_all(Car(**car) for car in DEFAULT_CARS)
            db.commit()