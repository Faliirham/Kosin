from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete

from app.database import get_db
from app.models import Kos
from app.schemas import KosResponse, PaginatedKos

router = APIRouter(prefix="/api/kos", tags=["Kos"])


@router.get("", response_model=PaginatedKos)
async def list_kos(
    city: str = Query(None),
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
    if search:
        query = query.where(Kos.name.ilike(f"%{search}%"))
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


@router.get("/{kos_id}", response_model=KosResponse)
async def detail_kos(kos_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Kos).where(Kos.id == kos_id))
    kos = result.scalar_one_or_none()
    if not kos:
        raise HTTPException(status_code=404, detail="Kos tidak ditemukan")
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
