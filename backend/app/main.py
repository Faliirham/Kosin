import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine
from app.models import Base
from app.routers import scraper, kos, stats


def _cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


async def run_migrations(conn) -> None:
    """Migrasi ringan & idempotent — dipakai saat startup maupun di test."""
    await conn.run_sync(Base.metadata.create_all)
    if conn.dialect.name == "postgresql":
        # Migrasi untuk tabel lama (idempotent, aman dijalankan tiap boot)
        await conn.execute(text("ALTER TABLE kos ADD COLUMN IF NOT EXISTS place_id VARCHAR(255)"))
        await conn.execute(text("ALTER TABLE kos ADD COLUMN IF NOT EXISTS source VARCHAR(20)"))
        await conn.execute(text("ALTER TABLE kos ADD COLUMN IF NOT EXISTS district VARCHAR(100)"))
    # Indeks pendukung dedup & pagination (PG/SQLite memperbolehkan banyak NULL pada UNIQUE)
    await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_kos_place_id ON kos (place_id)"))
    await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_kos_created_at ON kos (created_at)"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await run_migrations(conn)
    yield
    await engine.dispose()


app = FastAPI(title="Kos Finder API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper.router)
app.include_router(kos.router)
app.include_router(stats.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
