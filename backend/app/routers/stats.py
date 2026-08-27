from collections import Counter
from typing import Sequence

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Kos
from app.places import TTLCache

router = APIRouter(prefix="/api", tags=["Stats"])

PRICE_ORDER = ["Murah", "Sedang", "Mahal", "Sangat Mahal"]
MAX_CITIES = 30

# Hasil agregasi di-cache 60 detik agar landing page tidak melakukan
# full-table scan pada setiap kunjungan.
_stats_cache = TTLCache(ttl=60)


def build_stats(kos_list: Sequence[Kos]) -> dict:
    """Agregasi statistik dari daftar kos (fungsi murni, mudah diuji tanpa DB)."""
    total = len(kos_list)
    cities = Counter(k.city for k in kos_list if k.city)
    rated = [k.rating for k in kos_list if k.rating]
    prices = Counter(k.price_range for k in kos_list if k.price_range)
    sources = Counter(k.source or "osm" for k in kos_list)

    return {
        "total": total,
        "city_count": len(cities),
        "cities": [city for city, _ in cities.most_common(MAX_CITIES)],
        "avg_rating": round(sum(rated) / len(rated), 2) if rated else 0,
        "rated_count": len(rated),
        "price_distribution": {label: prices.get(label, 0) for label in PRICE_ORDER},
        "source_counts": {
            "gmaps": sources.get("gmaps", 0),
            "osm": sources.get("osm", 0),
        },
    }


async def _aggregate_stats(db: AsyncSession) -> dict:
    """Agregasi di sisi database (COUNT/AVG/GROUP BY) tanpa memuat semua baris."""
    total = await db.scalar(select(func.count()).select_from(Kos)) or 0

    city_rows = await db.execute(
        select(Kos.city, func.count())
        .where(Kos.city.isnot(None))
        .group_by(Kos.city)
        .order_by(func.count().desc())
        .limit(MAX_CITIES)
    )
    cities = [city for city, _ in city_rows.all()]

    rating_count, rating_avg = (
        await db.execute(
            select(func.count(), func.avg(Kos.rating)).where(Kos.rating.isnot(None))
        )
    ).one()

    price_rows = await db.execute(
        select(Kos.price_range, func.count())
        .where(Kos.price_range.isnot(None))
        .group_by(Kos.price_range)
    )
    prices = dict(price_rows.all())

    source_rows = await db.execute(select(Kos.source, func.count()).group_by(Kos.source))
    sources = {src or "osm": count for src, count in source_rows.all()}

    return {
        "total": total,
        "city_count": len(cities),
        "cities": cities,
        "avg_rating": round(rating_avg, 2) if rating_avg else 0,
        "rated_count": rating_count or 0,
        "price_distribution": {label: prices.get(label, 0) for label in PRICE_ORDER},
        "source_counts": {
            "gmaps": sources.get("gmaps", 0),
            "osm": sources.get("osm", 0),
        },
    }


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    cached = _stats_cache.get("stats")
    if cached is not None:
        return cached
    stats = await _aggregate_stats(db)
    _stats_cache.set("stats", stats)
    return stats