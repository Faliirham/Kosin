import asyncio

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Kos
from app.schemas import AreaCount, ScrapeRequest, ScrapeResponse
from app.scraper import scrape_kos

router = APIRouter(prefix="/api", tags=["Scraper"])

# Serialisasi scrape dalam satu worker agar request konkuren tidak
# menduplikasi baris maupun membakar quota Google Places.
_scrape_lock = asyncio.Lock()


def _refresh_kos(existing: Kos, kos_data) -> bool:
    """Refresh field non-null dari hasil scrape ke baris yang sudah ada."""
    fields = kos_data.model_dump(exclude={"place_id"})
    changed = False
    for field, value in fields.items():
        if value is not None and getattr(existing, field) != value:
            setattr(existing, field, value)
            changed = True
    return changed


@router.post("/scrape", response_model=ScrapeResponse)
async def trigger_scrape(req: ScrapeRequest, db: AsyncSession = Depends(get_db)):
    async with _scrape_lock:
        try:
            results = await scrape_kos(
                city=req.city,
                keyword=req.keyword,
                district=req.district,
                kelurahan=req.kelurahan,
                lat=req.lat,
                lng=req.lng,
                radius_km=req.radius_km,
            )
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 403:
                raise HTTPException(
                    status_code=502,
                    detail=(
                        "Google Places menolak request (403). Periksa GOOGLE_MAPS_API_KEY "
                        "dan pastikan Places API (New) aktif dengan billing di Google Cloud Console."
                    ),
                )
            raise HTTPException(status_code=502, detail=f"Google Places error: {e.response.status_code}")
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
                if _refresh_kos(existing, kos_data):
                    updated_count += 1
                continue
            try:
                # Savepoint per baris: jika terjadi tabrakan unique place_id
                # (scrape konkuren dari worker lain), cukup rollback baris ini.
                async with db.begin_nested():
                    db.add(Kos(**kos_data.model_dump()))
            except IntegrityError:
                if kos_data.place_id:
                    result = await db.execute(select(Kos).where(Kos.place_id == kos_data.place_id))
                    duplicate = result.scalar_one_or_none()
                    if duplicate is not None:
                        if _refresh_kos(duplicate, kos_data):
                            updated_count += 1
                        continue
                new_count += 1
                continue
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
