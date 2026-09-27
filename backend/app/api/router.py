from fastapi import APIRouter

from app.api.routes import auth, cars, leads, system, test_drives


api_router = APIRouter()
api_router.include_router(system.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(cars.router, prefix="/cars", tags=["cars"])
api_router.include_router(test_drives.router, prefix="/test-drives", tags=["test-drives"])
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])