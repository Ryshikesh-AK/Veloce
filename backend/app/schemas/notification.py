from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class NotificationRead(BaseModel):
    id: int
    type: str
    title: str
    message: str
    user_id: Optional[str] = None
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    items: list[NotificationRead]
    unread_count: int
