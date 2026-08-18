from uuid import UUID
import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, or_, false

from app import places
from app.database import get_db
from app.models import Kos
from app.schemas import KosResponse, PaginatedKos

router = APIRouter(prefix="/api/kos", tags=["Kos"])

logger = logging.getLogger(__name__)


def _escape_like(value: str) -> str:
    """Escape wildcard ILIKE agar input user tidak memperluas pencarian."""
    return value.replace("\\", "\\\\").replace("%", r"\%").replace("_", r"\_")


@router.get("", response_model=PaginatedKos)
async def list_kos(
    city: str = Query(None),
    district: str = Query(None),
    search: str = Query(None),
    min_rating: float = Query(None),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0, le=10_000),
    favorite_ids: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Kos)

    if favorite_ids is not None:
        raw_ids = [part.strip() for part in favorite_ids.split(",") if part.strip()]
        try:
            parsed_ids = [UUID(part) for part in raw_ids]
        except ValueError:
            raise HTTPException(status_code=422, detail="favorite_ids harus berupa UUID yang valid")
        if parsed_ids:
            query = query.where(Kos.id.in_(parsed_ids))
        else:
            query = query.where(false())

    if city:
        query = query.where(Kos.city.ilike(f"%{_escape_like(city)}%", escape="\\"))
    if district:
        query = query.where(Kos.district.ilike(f"%{_escape_like(district)}%", escape="\\"))
    if search:
        pattern = f"%{_escape_like(search)}%"
        query = query.where(
            or_(
                Kos.name.ilike(pattern, escape="\\"),
                Kos.address.ilike(pattern, escape="\\"),
                Kos.city.ilike(pattern, escape="\\"),
                Kos.district.ilike(pattern, escape="\\"),
            )
        )
    if min_rating is not None:
        query = query.where(Kos.rating >= min_rating)

    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    sort_col = getattr(Kos, sort, Kos.created_at)
    order_func = sort_col.desc if order == "desc" else sort_col.asc
    id_tiebreaker = Kos.id.desc() if order == "desc" else Kos.id.asc()
    query = query.order_by(order_func(), id_tiebreaker).offset(offset).limit(limit)

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
                "name": detail.get("name") if detail.get("name") is not None else kos.name,
                "address": detail.get("address") if detail.get("address") is not None else kos.address,
                "latitude": detail.get("latitude") if detail.get("latitude") is not None else kos.latitude,
                "longitude": detail.get("longitude") if detail.get("longitude") is not None else kos.longitude,
                "rating": detail.get("rating") if detail.get("rating") is not None else kos.rating,
                "total_reviews": detail.get("total_reviews") if detail.get("total_reviews") is not None else kos.total_reviews,
                "phone": detail.get("phone") if detail.get("phone") is not None else kos.phone,
                "website": detail.get("website") if detail.get("website") is not None else kos.website,
                "opening_hours": detail.get("opening_hours") if detail.get("opening_hours") is not None else kos.opening_hours,
                "price_range": places.price_level_to_range(detail.get("price_level"))
                or kos.price_range,
                "photos": photos or kos.photos,
                "google_maps_url": detail.get("google_maps_url") if detail.get("google_maps_url") is not None else kos.google_maps_url,
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
