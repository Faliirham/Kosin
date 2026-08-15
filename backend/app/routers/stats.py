from collections import Counter
from typing import Sequence

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Kos

router = APIRouter(prefix="/api", tags=["Stats"])

PRICE_ORDER = ["Murah", "Sedang", "Mahal", "Sangat Mahal"]
MAX_CITIES = 30


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


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Kos))
    kos_list = result.scalars().all()
    return build_stats(kos_list)
