from uuid import UUID
import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, or_

from app import places
from app.database import get_db
from app.models import Kos
from app.schemas import KosResponse, PaginatedKos

router = APIRouter(prefix="/api/kos", tags=["Kos"])

logger = logging.getLogger(__name__)


@router.get("", response_model=PaginatedKos)
async def list_kos(
    city: str = Query(None),
    district: str = Query(None),
    search: str = Query(None),
    min_rating: float = Query(None),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    query = select(Kos)

    if city:
        query = query.where(Kos.city.ilike(f"%{city}%"))
    if district:
        query = query.where(Kos.district.ilike(f"%{district}%"))
    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                Kos.name.ilike(pattern),
                Kos.address.ilike(pattern),
                Kos.city.ilike(pattern),
                Kos.district.ilike(pattern),
            )
        )
    if min_rating is not None:
        query = query.where(Kos.rating >= min_rating)

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    sort_col = getattr(Kos, sort, Kos.created_at)
    order_func = sort_col.desc if order == "desc" else sort_col.asc
    query = query.order_by(order_func()).offset(offset).limit(limit)

    result = await db.execute(query)
    kos_list = result.scalars().all()

    return PaginatedKos(
        data=[KosResponse.model_validate(k) for k in kos_list],
        total=total or 0,
    )


async def _enrich_gmaps(kos: Kos) -> Kos:
    """Live-fetch detail Google Places (rating, foto, dll) dengan cache ≤24 jam."""
    if kos.source != "gmaps" or not kos.place_id:
        return kos

    try:
        async with httpx.AsyncClient() as client:
            detail = await places.get_place_details(client, kos.place_id)
            if not detail:
                return kos

            photos = await places.resolve_photo_urls(client, detail.get("photos"), limit=5)

            enriched = {
                "name": detail.get("name") or kos.name,
                "address": detail.get("address") or kos.address,
                "latitude": detail.get("latitude") or kos.latitude,
                "longitude": detail.get("longitude") or kos.longitude,
                "rating": detail.get("rating") or kos.rating,
                "total_reviews": detail.get("total_reviews") or kos.total_reviews,
                "phone": detail.get("phone") or kos.phone,
                "website": detail.get("website") or kos.website,
                "opening_hours": detail.get("opening_hours") or kos.opening_hours,
                "price_range": places.price_level_to_range(detail.get("price_level"))
                or kos.price_range,
                "photos": photos or kos.photos,
                "google_maps_url": detail.get("google_maps_url") or kos.google_maps_url,
            }
            for field, value in enriched.items():
                if value is not None:
                    setattr(kos, field, value)
    except (httpx.HTTPError, RuntimeError) as e:
        logger.warning("Gagal enrich detail Google untuk %s: %s", kos.id, e)
    return kos


@router.get("/{kos_id}", response_model=KosResponse)
async def detail_kos(kos_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Kos).where(Kos.id == kos_id))
    kos = result.scalar_one_or_none()
    if not kos:
        raise HTTPException(status_code=404, detail="Kos tidak ditemukan")
    kos = await _enrich_gmaps(kos)
    return kos


@router.delete("/{kos_id}")
async def delete_kos(kos_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Kos).where(Kos.id == kos_id))
    kos = result.scalar_one_or_none()
    if not kos:
        raise HTTPException(status_code=404, detail="Kos tidak ditemukan")
    await db.execute(delete(Kos).where(Kos.id == kos_id))
    await db.commit()
    return {"message": "Kos berhasil dihapus"}
