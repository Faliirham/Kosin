import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Kos(Base):
    __tablename__ = "kos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    total_reviews = Column(Integer, nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    opening_hours = Column(JSON, nullable=True)
    price_range = Column(String(100), nullable=True)
    photos = Column(JSON, nullable=True)
    google_maps_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
