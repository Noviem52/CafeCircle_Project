from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import (
    auth,
    cafes,
    favorites,
    reservations,
    reviews,
    tables,
    uploads,
    users,
)
from app.core.config import UPLOAD_DIR, settings
from app.db.init_db import bootstrap


@asynccontextmanager
async def lifespan(_: FastAPI):
    bootstrap()
    yield


app = FastAPI(
    lifespan=lifespan,
    title="Café Circle API",
    description="Reservations, café listings, and owner approvals for Café Circle.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/", include_in_schema=False)
def root():
    return {"service": "cafe-circle-api", "docs": "/docs", "health": "/api/health"}


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok", "service": "cafe-circle-api"}


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(cafes.router, prefix="/api/cafes", tags=["cafes"])
app.include_router(tables.router, prefix="/api/tables", tags=["tables"])
app.include_router(
    reservations.router, prefix="/api/reservations", tags=["reservations"]
)
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["favorites"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
