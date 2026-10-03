from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import settings
from app.core.security import create_access_token, require_admin
from app.schemas.auth import LoginRequest, TokenResponse, UserRead


router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if payload.email.lower() != settings.admin_email.lower() or payload.password != settings.admin_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user_info = UserRead(
        id="admin_1",
        email=settings.admin_email,
        name="Admin",
        role="admin",
    )
    return TokenResponse(
        access_token=create_access_token(settings.admin_email),
        expires_in=settings.access_token_minutes * 60,
        user=user_info,
    )


@router.get("/me", response_model=UserRead)
def get_me(admin_email: str = Depends(require_admin)) -> UserRead:
    return UserRead(
        id="admin_1",
        email=admin_email,
        name="Admin",
        role="admin",
    )