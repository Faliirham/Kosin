from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine
from app.models import Base
from app.routers import scraper, kos


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(text("ALTER TABLE kos ADD COLUMN IF NOT EXISTS place_id VARCHAR(255)"))
        await conn.execute(text("ALTER TABLE kos ADD COLUMN IF NOT EXISTS source VARCHAR(20)"))
        await conn.execute(text("DELETE FROM kos WHERE source IS NULL OR source != 'gmaps'"))
    yield
    await engine.dispose()


app = FastAPI(title="Kos Finder API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper.router)
app.include_router(kos.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
