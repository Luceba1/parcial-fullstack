from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.db import create_db_and_tables
from app.routers.categoria_router import router as categoria_router
from app.routers.ingrediente_router import router as ingrediente_router
from app.routers.producto_router import router as producto_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categoria_router)
app.include_router(ingrediente_router)
app.include_router(producto_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "API del parcial funcionando."}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
