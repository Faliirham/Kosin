import logging
import math
import os

import httpx

from app.schemas import KosCreate
from app.scraper import _geocode_city

logger = logging.getLogger(__name__)

OVERPASS_URL = os.getenv("OVERPASS_API_URL", "https://overpass-api.de/api/interpreter")
USER_AGENT = "KosFinder/1.0 (kos-kosan search; OSM seed)"

# Tag OSM yang paling mendekati kos-kosan di Indonesia.
OSM_KOS_TAGS = [
    "tourism=hostel",
    "amenity=student_hostel",
    "amenity=boarding_house",
]


def _bbox(lat: float, lng: float, radius_km: float) -> str:
    """Kotak pembatas (south,west,north,east) untuk query Overpass."""
    dlat = radius_km / 111.0
    dlng = radius_km / max(1e-6, 111.0 * math.cos(math.radians(lat)))
    return f"{lat - dlat},{lng - dlng},{lat + dlat},{lng + dlng}"


def _build_query(bbox: str) -> str:
    tag_clauses = " ".join(
        f'["{k}"="{v}"]' for k, v in (t.split("=", 1) for t in OSM_KOS_TAGS)
    )
    return (
        "[out:json][timeout:25];\n"
        "(\n"
        f"  node{tag_clauses}({bbox});\n"
        f"  way{tag_clauses}({bbox});\n"
        f"  relation{tag_clauses}({bbox});\n"
        ");\n"
        "out center 200;\n"
    )


async def fetch_overpass_kos(
    city: str | None = None,
    district: str | None = None,
    kelurahan: str | None = None,
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float = 10.0,
) -> list[KosCreate]:
    """Seed data kos dari OpenStreetMap via Overpass API.

    Digunakan sebagai cadangan ketika Google Places tidak mengembalikan
    apa-apa untuk suatu kota, sehingga kota tersebut tetap punya hasil.
    """
    center = None
    if lat is not None and lng is not None:
        center = {"lat": lat, "lng": lng}
    else:
        location = city or district or kelurahan
        if not location:
            return []
        try:
            async with httpx.AsyncClient(timeout=30, headers={"User-Agent": USER_AGENT}) as client:
                center = await _geocode_city(client, location)
        except Exception as e:  # noqa: BLE001
            logger.warning("Geocode gagal untuk seed OSM %s: %s", location, e)
            return []
    if not center:
        return []

    bbox = _bbox(center["lat"], center["lng"], radius_km)
    query = _build_query(bbox)
    try:
        async with httpx.AsyncClient(timeout=40, headers={"User-Agent": USER_AGENT}) as client:
            resp = await client.post(OVERPASS_URL, data={"data": query})
            resp.raise_for_status()
            data = resp.json()
    except Exception as e:  # noqa: BLE001
        logger.warning("Overpass request gagal: %s", e)
        return []

    out: list[KosCreate] = []
    for el in data.get("elements", []):
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue

        if el["type"] == "node":
            elat, elng = el.get("lat"), el.get("lon")
        else:
            c = el.get("center")
            if not c:
                continue
            elat, elng = c.get("lat"), c.get("lon")
        if elat is None or elng is None:
            continue

        addr_parts = [tags.get("addr:housenumber"), tags.get("addr:street")]
        addr_parts = [p for p in addr_parts if p]
        if addr_parts:
            address = " ".join(addr_parts)
        else:
            address = tags.get("addr:full") or f"{name} ({city or district or 'Indonesia'})"

        out.append(
            KosCreate(
                place_id=f"osm_{el['type']}_{el['id']}",
                name=name,
                address=address,
                city=tags.get("addr:city") or city,
                district=tags.get("addr:suburb") or tags.get("addr:district") or district,
                kelurahan=kelurahan,
                latitude=elat,
                longitude=elng,
                rating=None,
                total_reviews=0,
                phone=tags.get("phone") or tags.get("contact:phone"),
                website=tags.get("website") or tags.get("contact:website"),
                opening_hours=tags.get("opening_hours"),
                price_range=None,
                photos=[],
                google_maps_url=None,
                source="osm",
            )
        )
    return out
