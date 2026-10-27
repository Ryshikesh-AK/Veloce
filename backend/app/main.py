from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import settings
from app.db.init_db import init_db


import logging

logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.auto_create_tables:
        try:
            init_db()
        except Exception as exc:
            logger.error(f"Database initialization deferred or failed on startup: {exc}")
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="REST API for the DriveXCars Motors car marketplace.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {exc}", exc_info=True)
    origin = request.headers.get("origin")
    headers = {}
    if origin:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
        headers=headers,
    )

settings.upload_directory.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_directory, check_dir=False), name="uploads")
app.include_router(api_router, prefix=settings.api_prefix)

from app.api.routes.ai import router as ai_direct_router
app.include_router(ai_direct_router, prefix="/api/ai", tags=["ai-direct"])


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {"name": settings.app_name, "docs": "/docs"}