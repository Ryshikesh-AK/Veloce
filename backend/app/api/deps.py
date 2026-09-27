from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.security import require_admin
from app.db.session import get_db

db_dependency = Depends(get_db)
admin_dependency = Depends(require_admin)