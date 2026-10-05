import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_current_user_payload, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserRead

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing_user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    new_user = User(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        role="customer",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_info = UserRead(
        id=new_user.id,
        email=new_user.email,
        name=new_user.full_name,
        role=new_user.role,
        phone=new_user.phone,
    )
    token = create_access_token(subject=new_user.email, user_id=new_user.id, role=new_user.role)
    return TokenResponse(
        access_token=token,
        expires_in=settings.access_token_minutes * 60,
        user=user_info,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    email_lower = payload.email.lower()

    # 1. Check if login is default admin email & config password
    if email_lower == settings.admin_email.lower() and payload.password == settings.admin_password:
        user = db.scalar(select(User).where(User.email == email_lower))
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=email_lower,
                hashed_password=hash_password(settings.admin_password),
                full_name="System Admin",
                role="admin",
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    else:
        # 2. Check standard user in Database
        user = db.scalar(select(User).where(User.email == email_lower))
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    user_info = UserRead(
        id=user.id,
        email=user.email,
        name=user.full_name,
        role=user.role,
        phone=user.phone,
    )
    token = create_access_token(subject=user.email, user_id=user.id, role=user.role)
    return TokenResponse(
        access_token=token,
        expires_in=settings.access_token_minutes * 60,
        user=user_info,
    )


@router.get("/me", response_model=UserRead)
def get_me(
    payload: dict | None = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
) -> UserRead:
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    email = payload.get("sub")
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserRead(
        id=user.id,
        email=user.email,
        name=user.full_name,
        role=user.role,
        phone=user.phone,
    )