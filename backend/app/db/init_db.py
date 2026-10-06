import uuid
from sqlalchemy import select

import app.models  # Ensures all models are registered in Base.metadata
from app.core.config import settings
from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.car import Car, CarImage
from app.models.user import User
from app.services.catalog import DEFAULT_CARS


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        # Seed Admin User if not exists
        admin_email = settings.admin_email.lower()
        admin_user = db.scalar(select(User).where(User.email == admin_email))
        if not admin_user:
            admin_user = User(
                id=str(uuid.uuid4()),
                email=admin_email,
                hashed_password=hash_password(settings.admin_password),
                full_name="System Admin",
                role="admin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()

        # Seed Default Cars if inventory is empty
        if db.scalar(select(Car.id).limit(1)) is None:
            for item in DEFAULT_CARS:
                car_data = item.copy()
                images_list = car_data.pop("images", [])
                car = Car(**car_data)
                db.add(car)
                db.flush()
                for idx, url in enumerate(images_list):
                    db.add(CarImage(car_id=car.id, url=url, is_primary=(idx == 0), display_order=idx))
            db.commit()