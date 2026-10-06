from fastapi import APIRouter

from app.api.routes import ai, auth, cars, leads, system


api_router = APIRouter()
api_router.include_router(system.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(cars.router, prefix="/cars", tags=["cars"])
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])