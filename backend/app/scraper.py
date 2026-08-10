import asyncio
import logging
import math
import os
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app import places
from app.schemas import KosCreate

load_dotenv()

logger = logging.getLogger(__name__)

GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "KosFinder/1.0 (kos-kosan search; geocode fallback)"
DEFAULT_RADIUS_KM = 12.0
EARTH_RADIUS_KM = 6371.0

# Fallback koordinat kota umum (dipakai saat Google Geocoding belum aktif/billing off)
CITY_FALLBACK = {
    "bandung": {"lat": -6.9175, "lng": 107.6191},
    "jakarta": {"lat": -6.2088, "lng": 106.8456},
    "surabaya": {"lat": -7.2575, "lng": 112.7521},
    "yogyakarta": {"lat": -7.7956, "lng": 110.3695},
    "semarang": {"lat": -6.9932, "lng": 110.4203},
    "medan": {"lat": 3.5952, "lng": 98.6722},
    "makassar": {"lat": -5.1477, "lng": 119.4327},
    "depok": {"lat": -6.4025, "lng": 106.7942},
    "tangerang": {"lat": -6.1783, "lng": 106.6319},
    "bekasi": {"lat": -6.2383, "lng": 106.9756},
    "bogor": {"lat": -6.5971, "lng": 106.806},
    "malang": {"lat": -7.9666, "lng": 112.6326},
    "denpasar": {"lat": -8.6705, "lng": 115.2126},
    "palembang": {"lat": -2.9761, "lng": 104.7754},
    "bandar lampung": {"lat": -5.3971, "lng": 105.2668},
}


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return EARTH_RADIUS_KM * 2 * math.asin(math.sqrt(a))


def _bounds_around(center: dict, radius_km: float) -> dict:
    """Perkiraan bounding box persegi di sekitar pusat kota."""
    lat_d = radius_km / 111.0
    lng_d = radius_km / (111.0 * max(0.2, math.cos(math.radians(center["lat"]))))
    return {
        "south": center["lat"] - lat_d,
        "north": center["lat"] + lat_d,
        "west": center["lng"] - lng_d,
        "east": center["lng"] + lng_d,
    }


def _extract_city(address: str | None, fallback: str) -> str:
    """Ekstrak kota sebenarnya dari formattedAddress Google, fallback ke kota yang dicari."""
    if not address:
        return fallback
    parts = [p.strip() for p in address.split(",")]
    bad = ("Jl.", "Jln.", "No.", "Gg.", "Gang")
    for part in parts:
        for marker in ("Kota ", "Kabupaten "):
            if part.startswith(marker) and not any(b in part for b in bad):
                return part
    return fallback


def _extract_district(address: str | None) -> str | None:
    """Ekstrak kecamatan/kelurahan dari formattedAddress Google."""
    if not address:
        return None
    parts = [p.strip() for p in address.split(",")]
    for marker in ("Kecamatan ", "Kec. ", "Kelurahan ", "Kel. "):
        for part in parts:
            if part.startswith(marker):
                return part
    return None


async def _geocode_nominatim(client: httpx.AsyncClient, location: str) -> dict | None:
    """Geocode lokasi via Nominatim (fallback saat Google Geocoding tidak tersedia)."""
    try:
        resp = await client.get(
            NOMINATIM_URL,
            params={
                "q": location,
                "format": "json",
                "limit": 1,
                "countrycodes": "id",
                "accept-language": "id",
            },
            headers={"User-Agent": USER_AGENT},
            timeout=30,
        )
        resp.raise_for_status()
        results = resp.json()
        if not results:
            return None
        result = results[0]
        south, north, west, east = (float(v) for v in result["boundingbox"])
        center = {"lat": float(result.get("lat", 0)), "lng": float(result.get("lon", 0))}
        return {
            "center": center,
            "bounds": {"south": south, "north": north, "west": west, "east": east},
        }
    except (httpx.HTTPError, ValueError, KeyError, IndexError) as e:
        logger.warning("Nominatim geocode gagal untuk %s: %s", location, e)
        return None


async def _geocode_city(client: httpx.AsyncClient, location: str) -> dict | None:
    """Geocode lokasi kota/kecamatan. Rantai: Google Geocoding -> Nominatim -> tabel kota umum."""
    geo = None
    try:
        resp = await client.get(
            GEOCODE_URL,
            params={"address": f"{location}, Indonesia", "key": places.API_KEY, "region": "id"},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        status = data.get("status")
        if status == "OK":
            result = data["results"][0]
            geometry = result.get("geometry", {})
            loc = geometry.get("location", {})
            ne = geometry.get("viewport", {}).get("northeast", {})
            sw = geometry.get("viewport", {}).get("southwest", {})
            center = {"lat": loc.get("lat", 0), "lng": loc.get("lng", 0)}
            geo = {
                "center": center,
                "bounds": {
                    "north": ne.get("lat", center["lat"]),
                    "east": ne.get("lng", center["lng"]),
                    "south": sw.get("lat", center["lat"]),
                    "west": sw.get("lng", center["lng"]),
                },
            }
        else:
            logger.warning("Google Geocoding %s (%s)", status, data.get("error_message", ""))
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as e:
        logger.warning("Google Geocoding gagal untuk %s: %s", location, e)

    if geo is not None:
        return geo

    nominatim = await _geocode_nominatim(client, location)
    if nominatim is not None:
        logger.info("Geocode %s via Nominatim (fallback)", location)
        return nominatim

    entry = CITY_FALLBACK.get(location.strip().lower())
    if entry:
        logger.info("Geocode %s via tabel kota umum (fallback)", location)
        center = {"lat": entry["lat"], "lng": entry["lng"]}
        return {"center": center, "bounds": _bounds_around(center, DEFAULT_RADIUS_KM)}

    raise RuntimeError(
        f"Tidak dapat menentukan lokasi '{location}'. "
        "Periksa ejaan kota/kecamatan, atau berikan lat/lng secara manual pada request."
    )


def _place_to_kos(place: dict, city: str) -> KosCreate:
    """Normalisasi hasil Google Places (search/details) -> KosCreate."""
    address = place.get("address")
    return KosCreate(
        name=place.get("name") or "Tanpa Nama",
        place_id=place.get("place_id"),
        source="gmaps",
        address=address,
        city=_extract_city(address, city),
        district=_extract_district(address),
        latitude=place.get("latitude"),
        longitude=place.get("longitude"),
        rating=place.get("rating"),
        total_reviews=place.get("total_reviews"),
        phone=place.get("phone"),
        website=place.get("website"),
        opening_hours=place.get("opening_hours"),
        price_range=places.price_level_to_range(place.get("price_level")),
        photos=place.get("photos"),
        google_maps_url=place.get("google_maps_url"),
    )


async def scrape_kos(
    city: str,
    keyword: str = "kos kosan",
    district: str | None = None,
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float | None = None,
) -> list[KosCreate]:
    """Scrape kos-kosan murni via Google Places API dengan pembatas lokasi kota/kecamatan."""
    radius = radius_km or DEFAULT_RADIUS_KM
    location_query = f"{district}, {city}" if district else city

    async with httpx.AsyncClient() as client:
        if lat is not None and lng is not None:
            center = {"lat": lat, "lng": lng}
            bounds = _bounds_around(center, radius)
        else:
            geo = await _geocode_city(client, location_query)
            if not geo:
                return []
            center = geo["center"]
            bounds = geo["bounds"]

        found = await places.search_places(client, location_query, keyword, bounds=bounds)
        if not found:
            logger.warning("Google Places tidak menemukan hasil untuk %s", location_query)
            return []

        results = [_place_to_kos(p, city) for p in found]
        filtered = []
        dropped = 0
        for kos in results:
            if (
                kos.latitude is not None
                and kos.longitude is not None
                and _haversine_km(kos.latitude, kos.longitude, center["lat"], center["lng"]) > radius
            ):
                dropped += 1
                continue
            filtered.append(kos)

        if dropped:
            logger.info("Dropped %d hasil di luar radius %s km dari %s", dropped, radius, city)

        logger.info("Scrape %s via Google Places: %d hasil (radius %s km)", city, len(filtered), radius)
        return filtered


async def _main() -> None:
    city = sys.argv[1] if len(sys.argv) > 1 else "Bandung"
    results = await scrape_kos(city)
    print(f"\nDitemukan {len(results)} kos di {city}:")
    for kos in results[:10]:
        print(f"  - {kos.name} ({kos.city})")
    if len(results) > 10:
        print(f"  ... dan {len(results) - 10} lainnya")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(_main())
