import asyncio
import logging
import time
from collections import defaultdict

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session
from app.models import Kos
from app.overpass import fetch_overpass_kos
from app.schemas import ScrapeRequest
from app.scraper import scrape_kos

router = APIRouter(prefix="/api", tags=["Scraper"])

logger = logging.getLogger(__name__)

# Lock per-kota: kota berbeda boleh scrape paralel; kota sama di-dedup
# agar tidak menduplikasi baris maupun membakar quota Google Places.
_scrape_locks: dict[str, asyncio.Lock] = {}

# Rate-limit scrape per IP (jaring pengaman kuota Google API).
_SCRAPE_MAX_PER_WINDOW = 3
_SCRAPE_WINDOW_SECONDS = 3600
_scrape_hits: dict[str, list[float]] = defaultdict(list)


def _refresh_kos(existing: Kos, kos_data) -> bool:
    """Refresh field non-null dari hasil scrape ke baris yang sudah ada."""
    fields = kos_data.model_dump(exclude={"place_id"})
    changed = False
    for field, value in fields.items():
        if value is not None and getattr(existing, field) != value:
            setattr(existing, field, value)
            changed = True
    return changed


def _check_scrape_rate_limit(ip: str) -> None:
    """Batasi jumlah scrape per IP dalam jendela waktu tertentu."""
    now = time.time()
    hits = [t for t in _scrape_hits[ip] if now - t < _SCRAPE_WINDOW_SECONDS]
    _scrape_hits[ip] = hits
    if len(hits) >= _SCRAPE_MAX_PER_WINDOW:
        wait = int(_SCRAPE_WINDOW_SECONDS - (now - hits[0])) + 1
        raise HTTPException(
            status_code=429,
            detail=(
                f"Terlalu banyak permintaan scrape ({_SCRAPE_MAX_PER_WINDOW}/jam). "
                f"Coba lagi dalam {wait} detik."
            ),
        )
    _scrape_hits[ip].append(now)


async def _run_scrape(req: ScrapeRequest, city_key: str) -> None:
    """Jalankan scrape di latar belakang: dedup per kota, simpan ke DB."""
    lock = _scrape_locks.setdefault(city_key, asyncio.Lock())
    async with lock:
        logger.info("Scrape background dimulai untuk %s", req.city)
        try:
            async with async_session() as db:
                results = await scrape_kos(
                    city=req.city,
                    keyword=req.keyword,
                    district=req.district,
                    kelurahan=req.kelurahan,
                    lat=req.lat,
                    lng=req.lng,
                    radius_km=req.radius_km,
                )
                if not results:
                    logger.info("Google kosong untuk %s, mencoba seed OSM/Overpass", req.city)
                    try:
                        osm = await fetch_overpass_kos(
                            city=req.city,
                            district=req.district,
                            kelurahan=req.kelurahan,
                            lat=req.lat,
                            lng=req.lng,
                            radius_km=req.radius_km,
                        )
                        if osm:
                            results = osm
                            logger.info("Seed OSM menghasilkan %d baris untuk %s", len(osm), req.city)
                    except Exception as e:  # noqa: BLE001
                        logger.warning("Seed OSM gagal untuk %s: %s", req.city, e)
                new_count = 0
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
                            new_count += 1
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
                                    new_count += 1
                                continue
                        new_count += 1
                        continue
                    new_count += 1
                await db.commit()
                logger.info(
                    "Scrape background selesai %s: %d baris baru/di-refresh", req.city, new_count
                )
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 403:
                logger.error("Google Places 403 untuk %s (periksa API key/billing)", req.city)
            else:
                logger.error("Google Places error %s untuk %s", e.response.status_code, req.city)
        except (RuntimeError, httpx.HTTPError) as e:
            logger.error("Scrape background gagal %s: %s", req.city, e)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Scrape background error tak terduga %s: %s", req.city, exc)


@router.post("/scrape")
async def trigger_scrape(req: ScrapeRequest, request: Request):
    """Terima permintaan scrape lalu jalankan di latar belakang.

    Mengembalikan respons cepat (202) agar user tidak menunggu proses yang
    bisa memakan menit. Frontend melakukan polling ke GET /api/kos untuk
    menampilkan data yang masuk.
    """
    ip = request.client.host if request.client else "unknown"
    _check_scrape_rate_limit(ip)
    city_key = (req.city or "").strip().lower()
    asyncio.create_task(_run_scrape(req, city_key))
    return {"status": "accepted", "message": f"Scrape untuk {req.city} sedang berjalan di latar belakang."}
