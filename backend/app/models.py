import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON, Uuid
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Kos(Base):
    __tablename__ = "kos"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    place_id = Column(String(255), nullable=True)
    source = Column(String(20), nullable=True, default="osm", index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True, index=True)
    kelurahan = Column(String(100), nullable=True, index=True)
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
