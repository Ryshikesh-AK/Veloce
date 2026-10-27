from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRead(BaseModel):
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    full_name: str = Field(min_length=1, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=40)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead