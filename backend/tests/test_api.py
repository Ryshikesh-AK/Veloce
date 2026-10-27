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
            _env_file=None,
            environment="production",
            jwt_secret_key="production-secret-value-that-is-long-enough",
            admin_password="non-default-admin-password",
            cloudinary_cloud_name=None,
            cloudinary_api_key=None,
            cloudinary_api_secret=None,
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
    monkeypatch.setattr(settings, "cloudinary_cloud_name", "")
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


def test_user_registration_and_login_flow() -> None:
    # 1. Register new user
    reg_payload = {
        "email": "collector@drivexcars.co.uk",
        "password": "SecurePassword123!",
        "full_name": "VIP Collector",
        "phone": "+447911123456",
    }
    reg_resp = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "collector@drivexcars.co.uk"
    assert reg_data["user"]["role"] == "customer"

    # 2. Duplicate registration rejection
    dup_resp = client.post("/api/v1/auth/register", json=reg_payload)
    assert dup_resp.status_code == 400
    assert "already exists" in dup_resp.json()["detail"]

    # 3. Successful login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "collector@drivexcars.co.uk", "password": "SecurePassword123!"},
    )
    assert login_resp.status_code == 200
    user_token = login_resp.json()["access_token"]

    # 4. Access /me as customer
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {user_token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "collector@drivexcars.co.uk"
    assert me_resp.json()["role"] == "customer"

    # 5. Customer cannot access admin routes (role boundary)
    forbidden_resp = client.post(
        "/api/v1/cars",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"name": "Hacked", "year": 2024, "type": "SUV", "price": 100000, "image": "https://example.com/h.jpg"},
    )
    assert forbidden_resp.status_code == 403


def test_login_invalid_credentials_returns_generic_401() -> None:
    resp = client.post("/api/v1/auth/login", json={"email": "unknown@example.com", "password": "wrong"})
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Invalid email or password"


def test_system_health_endpoint() -> None:
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
    assert resp.json()["database"] == "ok"


def test_lead_creation_and_admin_management() -> None:
    # 1. Create lead
    lead_payload = {
        "name": "James Bond",
        "phone": "+447000000007",
        "email": "bond@mi6.gov.uk",
        "action_type": "test_drive",
        "notes": "Aston Martin preferred",
    }
    create_resp = client.post("/api/v1/leads", json=lead_payload)
    assert create_resp.status_code == 201
    lead_id = int(create_resp.json()["id"])

    # 2. Non-admin cannot view leads
    assert client.get("/api/v1/leads").status_code == 401

    # 3. Admin can list leads
    leads_resp = client.get("/api/v1/leads", headers={"Authorization": f"Bearer {admin_token()}"})
    assert leads_resp.status_code == 200
    leads_list = leads_resp.json()
    assert any(l["id"] == lead_id for l in leads_list)

    # 4. Admin updates lead status
    status_resp = client.patch(
        f"/api/v1/leads/{lead_id}/status",
        headers={"Authorization": f"Bearer {admin_token()}"},
        json={"status": "Contacted"},
    )
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "Contacted"


def test_neon_database_url_normalization() -> None:
    from app.core.config import Settings

    s1 = Settings(_env_file=None, database_url="postgresql://user:pass@ep-cool.neon.tech/neondb?sslmode=require")
    assert s1.database_url.startswith("postgresql+psycopg://")

    s2 = Settings(_env_file=None, database_url="postgres://user:pass@ep-cool.neon.tech/neondb?sslmode=require")
    assert s2.database_url.startswith("postgresql+psycopg://")


