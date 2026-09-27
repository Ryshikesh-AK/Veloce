from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreate


router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    lead = Lead(**payload.model_dump())
    lead.email = lead.email.lower()
    db.add(lead)
    db.commit()
    return {"status": "received"}