from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationListResponse, NotificationRead

router = APIRouter()


@router.get("", response_model=NotificationListResponse)
def list_notifications(
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> NotificationListResponse:
    statement = select(Notification).order_by(Notification.created_at.desc()).limit(100)
    items = list(db.scalars(statement).all())
    unread_count = db.scalar(select(func.count()).select_from(Notification).where(Notification.is_read.is_(False))) or 0
    return NotificationListResponse(items=items, unread_count=unread_count)


@router.patch("/{notification_id}/read", response_model=NotificationRead)
def mark_notification_read(
    notification_id: int,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Notification:
    notif = db.get(Notification, notification_id)
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif


@router.post("/mark-all-read")
def mark_all_notifications_read(
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    db.execute(update(Notification).where(Notification.is_read.is_(False)).values(is_read=True))
    db.commit()
    return {"status": "ok"}
