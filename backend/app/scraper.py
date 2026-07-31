import asyncio
import logging
import os

import httpx
from dotenv import load_dotenv

from app.schemas import KosCreate

load_dotenv()

logger = logging.getLogger(__name__)

NOMINATIM_URL = os.getenv("NOMINATIM_URL", "https://nominatim.openstreetmap.org/search")
OVERPASS_URL = os.getenv("OVERPASS_API_URL", "https://overpass-api.de/api/interpreter")
OVERPASS_MIRRORS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.osm.ch/api/interpreter",
]
USER_AGENT = "KosFinder/1.0 (kos-kosan search demo; contact: localhost)"

# Tag kombinasi yang mendekati "kos-kosan" di OSM
OVERPASS_TAGS = [
    'nwr["tourism"="guest_house"]',
    'nwr["tourism"="apartment"]',
    'nwr["building"="apartments"]',
]

OVERPASS_QUERY_TEMPLATE = """[out:json][timeout:45];
(
{queries}
);
out center tags {limit};
"""


def _query_bbox(south: float, west: float, north: float, east: float, limit: int = 300) -> str:
    bbox = f"({south},{west},{north},{east})"
    queries = "\n".join(f"  {tag}{bbox};" for tag in OVERPASS_TAGS)
    return OVERPASS_QUERY_TEMPLATE.format(queries=queries, limit=limit)


async def _geocode_city(client: httpx.AsyncClient, city: str) -> dict | None:
    resp = await client.get(
        NOMINATIM_URL,
        params={
            "q": city,
            "format": "json",
            "limit": 1,
            "countrycodes": "id",
            "accept-language": "id",
        },
        headers={"User-Agent": USER_AGENT},
    )
    resp.raise_for_status()
    results = resp.json()
    if not results:
        return None

    result = results[0]
    south, north, west, east = (float(v) for v in result["boundingbox"])
    return {
        "display_name": result.get("display_name", city),
        "lat": float(result.get("lat", 0)),
        "lon": float(result.get("lon", 0)),
        "bbox": {"south": south, "west": west, "north": north, "east": east},
    }


async def _query_overpass(client: httpx.AsyncClient, query: str) -> list[dict]:
    last_error = None
    endpoints = [OVERPASS_URL, *OVERPASS_MIRRORS]
    for url in endpoints:
        try:
            resp = await client.post(
                url,
                data={"data": query},
                headers={"User-Agent": USER_AGENT},
                timeout=60,
            )
            resp.raise_for_status()
            return resp.json().get("elements", [])
        except (httpx.HTTPError, ValueError) as e:
            last_error = e
            logger.warning("Overpass endpoint %s gagal: %s", url, e)
            await asyncio.sleep(2)
    raise RuntimeError(f"Semua endpoint Overpass gagal: {last_error}")


def _osm_element_to_kos(el: dict, city: str) -> KosCreate:
    tags = el.get("tags", {})
    name = tags.get("name", "")
    if not name:
        return None

    lat = el.get("lat")
    lon = el.get("lon")
    if lat is None or lon is None:
        center = el.get("center", {})
        lat = center.get("lat")
        lon = center.get("lon")

    street = tags.get("addr:street")
    housenumber = tags.get("addr:housenumber")
    address = " ".join(part for part in [housenumber, street] if part)
    if not address:
        address = tags.get("addr:full")

    phone = tags.get("contact:phone") or tags.get("phone")
    website = tags.get("contact:website") or tags.get("website")
    opening_hours = [tags["opening_hours"]] if tags.get("opening_hours") else None

    osm_url = None
    if lat is not None and lon is not None:
        osm_url = f"https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=17/{lat}/{lon}"

    return KosCreate(
        name=name,
        address=address,
        city=tags.get("addr:city", city),
        latitude=lat,
        longitude=lon,
        phone=phone,
        website=website,
        opening_hours=opening_hours,
        google_maps_url=osm_url,
    )


def _mock_data(city: str) -> list[KosCreate]:
    return [
        KosCreate(
            name=f"Kos Melati {city}",
            address=f"Jl. Merdeka No. 10, {city}",
            city=city,
            latitude=-6.9175,
            longitude=107.6191,
            rating=4.5,
            total_reviews=23,
            phone="0812-3456-7890",
            price_range="Sedang",
            google_maps_url="https://www.openstreetmap.org/?mlat=-6.9175&mlon=107.6191#map=17/-6.9175/107.6191",
        ),
        KosCreate(
            name=f"Kos Mawar Indah {city}",
            address=f"Jl. Diponegoro No. 25, {city}",
            city=city,
            latitude=-6.9275,
            longitude=107.6291,
            rating=4.2,
            total_reviews=15,
            phone="0813-9876-5432",
            price_range="Murah",
            google_maps_url="https://www.openstreetmap.org/?mlat=-6.9275&mlon=107.6291#map=17/-6.9275/107.6291",
        ),
        KosCreate(
            name=f"Kos Anggrek Putih {city}",
            address=f"Jl. Sudirman No. 5, {city}",
            city=city,
            latitude=-6.9075,
            longitude=107.6091,
            rating=4.8,
            total_reviews=42,
            phone="0821-1111-2222",
            website="https://kosanggrek.example.com",
            price_range="Mahal",
            google_maps_url="https://www.openstreetmap.org/?mlat=-6.9075&mlon=107.6091#map=17/-6.9075/107.6091",
        ),
    ]


async def scrape_kos(city: str, keyword: str = "kos kosan") -> list[KosCreate]:
    try:
        async with httpx.AsyncClient() as client:
            geo = await _geocode_city(client, city)
            if not geo:
                logger.warning("Kota '%s' tidak ditemukan di Nominatim, fallback mock", city)
                return _mock_data(city)

            query = _query_bbox(**geo["bbox"])
            elements = await _query_overpass(client, query)

            results = []
            seen = set()
            for el in elements:
                kos = _osm_element_to_kos(el, city)
                if not kos:
                    continue
                key = (kos.name.lower(), (kos.address or "").lower())
                if key in seen:
                    continue
                seen.add(key)
                results.append(kos)

            if not results:
                logger.warning("Tidak ada kos ditemukan untuk %s, fallback mock", city)
                return _mock_data(city)
            return results
    except (httpx.HTTPError, RuntimeError) as e:
        logger.error("Scraper gagal (%s), fallback mock: %s", city, e)
        return _mock_data(city)
