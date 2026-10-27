from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter(tags=["system"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db_status = "ok"
    db_error = None
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = "unavailable"
        db_error = str(exc)

    response_data = {"status": "ok", "database": db_status}
    if db_error:
        response_data["error"] = db_error
    if db_status != "ok":
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=response_data)
    return response_data