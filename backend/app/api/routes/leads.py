from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user_payload, require_admin
from app.db.session import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadRead, LeadStatusUpdate

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_lead(
    payload: LeadCreate,
    user_payload: Optional[dict] = Depends(get_current_user_payload),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    user_id = user_payload.get("user_id") if user_payload else None

    lead = Lead(
        name=payload.name,
        phone=payload.phone,
        email=payload.email.lower() if payload.email else None,
        user_id=user_id,
        car_id=payload.car_id,
        action_type=payload.action_type,
        notes=payload.notes,
        status="Pending Call",
    )
    db.add(lead)
    db.commit()
    return {"status": "received", "id": str(lead.id)}


@router.get("", response_model=List[LeadRead])
def get_leads(
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> List[Lead]:
    statement = select(Lead).order_by(Lead.created_at.desc())
    return list(db.scalars(statement).all())


@router.patch("/{lead_id}/status", response_model=LeadRead)
def update_lead_status(
    lead_id: int,
    payload: LeadStatusUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Lead:
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    lead.status = payload.status
    if payload.status.lower() in ["contacted", "interested"]:
        lead.contacted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(lead)
    return lead