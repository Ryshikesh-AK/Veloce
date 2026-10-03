from pydantic import BaseModel, EmailStr


class UserRead(BaseModel):
    id: str
    email: str
    name: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead