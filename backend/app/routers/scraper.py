import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Kos
from app.schemas import AreaCount, ScrapeRequest, ScrapeResponse
from app.scraper import scrape_kos

router = APIRouter(prefix="/api", tags=["Scraper"])


@router.post("/scrape", response_model=ScrapeResponse)
async def trigger_scrape(req: ScrapeRequest, db: AsyncSession = Depends(get_db)):
    try:
        results = await scrape_kos(
            city=req.city,
            keyword=req.keyword,
            district=req.district,
            lat=req.lat,
            lng=req.lng,
            radius_km=req.radius_km,
        )
    except (RuntimeError, httpx.HTTPError) as e:
        raise HTTPException(status_code=502, detail=str(e))

    new_count = 0
    updated_count = 0
    areas: dict[str, int] = {}
    seen_areas: set[str] = set()
    for kos_data in results:
        area_key = kos_data.place_id or f"{kos_data.name}|{kos_data.address}"
        if area_key not in seen_areas:
            seen_areas.add(area_key)
            if kos_data.district:
                areas[kos_data.district] = areas.get(kos_data.district, 0) + 1
        existing = None
        if kos_data.place_id:
            result = await db.execute(select(Kos).where(Kos.place_id == kos_data.place_id))
            existing = result.scalar_one_or_none()
        if not existing:
            result = await db.execute(
                select(Kos).where(Kos.name == kos_data.name, Kos.address == kos_data.address)
            )
            existing = result.scalar_one_or_none()
        if existing:
            fields = kos_data.model_dump(exclude={"place_id"})
            changed = False
            for field, value in fields.items():
                if value is not None and getattr(existing, field) != value:
                    setattr(existing, field, value)
                    changed = True
            if changed:
                updated_count += 1
            continue
        db.add(Kos(**kos_data.model_dump()))
        new_count += 1

    await db.commit()
    area_list = [
        AreaCount(district=district, count=count)
        for district, count in sorted(areas.items(), key=lambda item: -item[1])[:12]
    ]
    return ScrapeResponse(
        message="Scrape selesai",
        total_scraped=new_count,
        areas=area_list,
    )
