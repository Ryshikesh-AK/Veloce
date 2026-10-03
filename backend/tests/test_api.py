import os

os.environ["DATABASE_URL"] = "sqlite:///./test_DriveXCars.db"
os.environ["ADMIN_EMAIL"] = "admin@example.com"
os.environ["ADMIN_PASSWORD"] = "test-password"

from datetime import datetime, timedelta, timezone
from starlette.routing import Mount

import pytest
from pydantic import ValidationError
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app


test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
event.listen(test_engine, "connect", lambda connection, _: connection.execute("PRAGMA foreign_keys=ON"))
TestingSession = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)
Base.metadata.create_all(test_engine)


def override_get_db():
    with TestingSession() as db:
        yield db


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_production_settings_require_cloudinary_credentials() -> None:
    from app.core.config import Settings

    with pytest.raises(ValidationError, match="Cloudinary credentials are required"):
        Settings(
            environment="production",
            jwt_secret_key="production-secret-value-that-is-long-enough",
            admin_password="non-default-admin-password",
        )


@pytest.mark.parametrize("origin", ["http://127.0.0.1:5173", "http://127.0.0.1:5174"])
def test_local_development_origins_are_allowed_by_cors(origin: str) -> None:
    response = client.options(
        "/api/v1/cars",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_relative_upload_directory_is_anchored_to_backend() -> None:
    from app.core.config import BACKEND_DIRECTORY, Settings

    settings = Settings(_env_file=None, upload_directory="uploads")

    assert settings.upload_directory == BACKEND_DIRECTORY / "uploads"


def setup_function() -> None:
    with Session(test_engine) as db:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()


def admin_token() -> str:
    response = client.post("/api/v1/auth/login", json={"email": "admin@example.com", "password": "test-password"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@example.com"
    assert data["user"]["role"] == "admin"
    return data["access_token"]


def test_auth_me_endpoint() -> None:
    token = admin_token()
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "admin@example.com"
    assert response.json()["role"] == "admin"



def create_car() -> dict:
    response = client.post(
        "/api/v1/cars",
        headers={"Authorization": f"Bearer {admin_token()}"},
        json={
            "name": "Test Motors", "model": "Roadster", "year": 2025, "type": "Sports",
            "price": 80000, "mileage": 1200, "fuel": "Petrol", "transmission": "Automatic",
            "image": "https://example.com/car.jpg", "description": "Test listing",
        },
    )
    assert response.status_code == 201
    return response.json()


def test_public_inventory_and_admin_guard() -> None:
    created = create_car()
    assert created["currency"] == "USD"
    listing = client.get("/api/v1/cars", params={"search": "Roadster"})
    assert listing.status_code == 200
    assert listing.json()["items"][0]["id"] == created["id"]
    assert client.delete(f"/api/v1/cars/{created['id']}").status_code == 401


def test_car_crud_and_delete() -> None:
    car = create_car()
    assert client.get(f"/api/v1/cars/{car['id']}").json()["name"] == "Test Motors"

    updated = client.patch(
        f"/api/v1/cars/{car['id']}",
        headers={"Authorization": f"Bearer {admin_token()}"},
        json={"price": 88000, "currency": "GBP", "isFeatured": True},
    )
    assert updated.status_code == 200
    assert updated.json()["price"] == "88000.00"
    assert updated.json()["currency"] == "GBP"
    assert updated.json()["isFeatured"] is True

    invalid_currency = client.patch(
        f"/api/v1/cars/{car['id']}",
        headers={"Authorization": f"Bearer {admin_token()}"},
        json={"currency": "CAD"},
    )
    assert invalid_currency.status_code == 422

    deleted = client.delete(
        f"/api/v1/cars/{car['id']}",
        headers={"Authorization": f"Bearer {admin_token()}"},
    )
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/cars/{car['id']}").status_code == 404


def test_admin_image_upload_and_public_retrieval(tmp_path, monkeypatch) -> None:
    from app.core.config import settings

    monkeypatch.setattr(settings, "upload_directory", tmp_path)
    uploads_mount = next(route for route in app.routes if isinstance(route, Mount) and route.path == "/uploads")
    monkeypatch.setattr(uploads_mount.app, "directory", str(tmp_path))
    monkeypatch.setattr(uploads_mount.app, "all_directories", [str(tmp_path)])
    image_content = b"\x89PNG\r\n\x1a\nimage-data"
    headers = {"Authorization": f"Bearer {admin_token()}"}

    unauthorized = client.post(
        "/api/v1/cars/images",
        content=image_content,
        headers={"Content-Type": "image/png"},
    )
    assert unauthorized.status_code == 401

    uploaded = client.post(
        "/api/v1/cars/images",
        content=image_content,
        headers={**headers, "Content-Type": "image/png"},
    )
    assert uploaded.status_code == 200
    image_url = uploaded.json()["image"]
    assert image_url.startswith("/uploads/")
    assert client.get(image_url).content == image_content

    invalid = client.post(
        "/api/v1/cars/images",
        content=b"not-an-image",
        headers={**headers, "Content-Type": "image/png"},
    )
    assert invalid.status_code == 415


def test_admin_image_upload_uses_cloudinary(monkeypatch) -> None:
    from app.api.routes import cars
    from app.core.config import settings

    monkeypatch.setattr(settings, "cloudinary_cloud_name", "test-cloud")
    monkeypatch.setattr(settings, "cloudinary_api_key", "test-key")
    monkeypatch.setattr(settings, "cloudinary_api_secret", "test-secret")
    uploaded_options = {}

    def fake_upload(image, **options):
        assert image.read() == b"\x89PNG\r\n\x1a\nimage-data"
        uploaded_options.update(options)
        return {"secure_url": "https://res.cloudinary.com/test-cloud/image/upload/DriveXCars/cars/test.png"}

    monkeypatch.setattr(cars.uploader, "upload", fake_upload)
    response = client.post(
        "/api/v1/cars/images",
        content=b"\x89PNG\r\n\x1a\nimage-data",
        headers={"Authorization": f"Bearer {admin_token()}", "Content-Type": "image/png"},
    )

    assert response.status_code == 200
    assert response.json()["image"].startswith("https://res.cloudinary.com/")
    assert uploaded_options["folder"] == "DriveXCars/cars"
    assert uploaded_options["resource_type"] == "image"


def test_car_with_test_drive_cannot_be_deleted() -> None:
    car = create_car()
    client.post(
        "/api/v1/test-drives",
        json={
            "carId": car["id"],
            "customerName": "Jordan Miller",
            "customerEmail": "buyer@example.com",
            "preferredAt": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
        },
    )

    deleted = client.delete(
        f"/api/v1/cars/{car['id']}",
        headers={"Authorization": f"Bearer {admin_token()}"},
    )
    assert deleted.status_code == 409
    assert "test-drive" in deleted.json()["detail"]


def test_test_drive_can_be_created_and_reviewed() -> None:
    car = create_car()
    payload = {
        "carId": car["id"], "customerName": "Jordan Miller", "customerEmail": "buyer@example.com",
        "preferredAt": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
    }
    created = client.post("/api/v1/test-drives", json=payload)
    assert created.status_code == 201
    assert created.json()["status"] == "pending"
    request_id = created.json()["id"]

    mine = client.get("/api/v1/test-drives/mine", params={"email": "BUYER@example.com"})
    assert mine.status_code == 200
    assert len(mine.json()) == 1

    approved = client.patch(
        f"/api/v1/test-drives/{request_id}",
        headers={"Authorization": f"Bearer {admin_token()}"},
        json={"status": "approved", "approvedAt": payload["preferredAt"]},
    )
    assert approved.status_code == 200
    assert approved.json()["status"] == "approved"