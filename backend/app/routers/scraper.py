from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Kos
from app.schemas import ScrapeRequest, ScrapeResponse
from app.scraper import scrape_kos

router = APIRouter(prefix="/api", tags=["Scraper"])


@router.post("/scrape", response_model=ScrapeResponse)
async def trigger_scrape(req: ScrapeRequest, db: AsyncSession = Depends(get_db)):
    results = await scrape_kos(city=req.city, keyword=req.keyword)

    new_count = 0
    for kos_data in results:
        existing = await db.execute(
            select(Kos).where(Kos.name == kos_data.name, Kos.address == kos_data.address)
        )
        if not existing.scalar_one_or_none():
            db.add(Kos(**kos_data.model_dump()))
            new_count += 1

    await db.commit()
    return ScrapeResponse(message="Scrape selesai", total_scraped=new_count)
