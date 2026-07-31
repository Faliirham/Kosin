from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class KosBase(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = None
    total_reviews: Optional[int] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    opening_hours: Optional[dict] = None
    price_range: Optional[str] = None
    photos: Optional[list] = None
    google_maps_url: Optional[str] = None


class KosCreate(KosBase):
    pass


class KosResponse(KosBase):
    id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


class ScrapeRequest(BaseModel):
    city: str
    keyword: str = "kos kosan"


class ScrapeResponse(BaseModel):
    message: str
    total_scraped: int


class PaginatedKos(BaseModel):
    data: list[KosResponse]
    total: int
