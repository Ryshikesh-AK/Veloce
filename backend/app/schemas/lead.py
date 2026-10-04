from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class LeadCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=3, max_length=40)
    email: Optional[str] = None
    car_id: Optional[int] = None
    action_type: str = Field(default="wishlist")
    notes: Optional[str] = None


class LeadRead(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    user_id: Optional[str] = None
    car_id: Optional[int] = None
    action_type: str
    status: str
    notes: Optional[str] = None
    contacted_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LeadStatusUpdate(BaseModel):
    status: str