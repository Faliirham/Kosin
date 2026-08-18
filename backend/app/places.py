import logging
import os
import time

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
DETAILS_URL = "https://places.googleapis.com/v1/places/{place_id}"
PHOTO_URL = "https://places.googleapis.com/v1/{name}/media"

PHOTO_MAX_WIDTH = 1200
MAX_RESULTS = 60
DEFAULT_MAX_PAGES = int(os.getenv("SCRAPE_MAX_PAGES", "3"))
CACHE_TTL = 24 * 60 * 60  # 24 jam (sesuai ToS & README)

# Field mask untuk search & details (hemat biaya, sesuai kebutuhan)
SEARCH_FIELDS = ",".join(
    [
        "places.id",
        "places.displayName.text",
        "places.formattedAddress",
        "places.location",
        "places.rating",
        "places.userRatingCount",
        "places.nationalPhoneNumber",
        "places.websiteUri",
        "places.regularOpeningHours.weekdayDescriptions",
        "places.priceLevel",
        "places.photos.name",
        "places.googleMapsUri",
    ]
)
DETAILS_FIELDS = SEARCH_FIELDS.replace("places.", "")

PRICE_LEVEL_MAP = {
    0: "Murah",
    1: "Murah",
    2: "Sedang",
    3: "Mahal",
    4: "Sangat Mahal",
}


class TTLCache:
    def __init__(self, ttl: int = CACHE_TTL):
        self._ttl = ttl
        self._store: dict[str, tuple[float, object]] = {}

    def get(self, key: str) -> object | None:
        item = self._store.get(key)
        if not item:
            return None
        ts, value = item
        if time.time() - ts > self._ttl:
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: object) -> None:
        self._store[key] = (time.time(), value)

    def clear(self) -> None:
        self._store.clear()


cache = TTLCache()


def _headers() -> dict:
    return {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
    }


def _raise_if_unavailable() -> None:
    if not API_KEY or API_KEY == "your_api_key_here":
        raise RuntimeError("GOOGLE_MAPS_API_KEY belum dikonfigurasi")


def price_level_to_range(level: int | None) -> str | None:
    if level is None:
        return None
    return PRICE_LEVEL_MAP.get(level, "Sedang")


def _normalize_place(place: dict) -> dict:
    location = place.get("location", {})
    photos = [p["name"] for p in place.get("photos", [])] or None
    opening_hours = place.get("regularOpeningHours")
    return {
        "place_id": place.get("id"),
        "name": (place.get("displayName") or {}).get("text"),
        "address": place.get("formattedAddress"),
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "rating": place.get("rating"),
        "total_reviews": place.get("userRatingCount"),
        "phone": place.get("nationalPhoneNumber"),
        "website": place.get("websiteUri"),
        "opening_hours": opening_hours.get("weekdayDescriptions") if opening_hours else None,
        "price_level": place.get("priceLevel"),
        "photos": photos,
        "google_maps_url": place.get("googleMapsUri"),
    }


def _bounds_key(bounds: dict | None) -> str:
    if not bounds:
        return "all"
    return "{:.5f},{:.5f},{:.5f},{:.5f}".format(
        bounds.get("south", 0), bounds.get("west", 0), bounds.get("north", 0), bounds.get("east", 0)
    )


async def search_places(
    client: httpx.AsyncClient,
    city: str,
    keyword: str,
    bounds: dict | None = None,
    max_pages: int | None = None,
) -> list[dict]:
    """Text Search (New) dengan pagination, cache, dan locationRestriction."""
    _raise_if_unavailable()

    page_limit = min(max(1, int(max_pages if max_pages is not None else DEFAULT_MAX_PAGES)), 5)
    cache_key = f"search:{city.lower()}:{keyword.lower()}:{_bounds_key(bounds)}:p{page_limit}"
    cached = cache.get(cache_key)
    if cached is not None:
        logger.info("Cache hit search %s", cache_key)
        return cached
    results: list[dict] = []
    page_token = None
    query = f"{keyword} {city}".strip()
    body: dict = {
        "textQuery": query,
        "languageCode": "id",
        "regionCode": "ID",
        "maxResultCount": 20,
    }
    if bounds:
        body["locationRestriction"] = {
            "rectangle": {
                "low": {"latitude": bounds["south"], "longitude": bounds["west"]},
                "high": {"latitude": bounds["north"], "longitude": bounds["east"]},
            }
        }

    for _ in range(page_limit):  # max ~20 * page_limit hasil
        if page_token:
            body["pageToken"] = page_token
        resp = await client.post(
            TEXT_SEARCH_URL,
            json=body,
            headers={**_headers(), "X-Goog-FieldMask": SEARCH_FIELDS},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        for place in data.get("places", []):
            normalized = _normalize_place(place)
            if normalized.get("place_id") and normalized.get("name"):
                results.append(normalized)
        page_token = data.get("nextPageToken")
        if not page_token:
            break

    cache.set(cache_key, results)
    return results


async def get_place_details(client: httpx.AsyncClient, place_id: str) -> dict | None:
    """Place Details (New) dengan cache ≤24 jam."""
    _raise_if_unavailable()

    cache_key = f"details:{place_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        logger.info("Cache hit details %s", place_id)
        return cached

    resp = await client.get(
        DETAILS_URL.format(place_id=place_id),
        headers={**_headers(), "X-Goog-FieldMask": DETAILS_FIELDS},
        timeout=30,
    )
    if resp.status_code == 404:
        logger.warning("Place %s tidak ditemukan", place_id)
        return None
    resp.raise_for_status()

    normalized = _normalize_place(resp.json())
    cache.set(cache_key, normalized)
    return normalized


async def get_photo_url(client: httpx.AsyncClient, photo_name: str, width: int = PHOTO_MAX_WIDTH) -> str | None:
    """Resolve photo name -> URL gambar (skipHttpRedirect agar aman, tanpa key di URL)."""
    _raise_if_unavailable()

    cache_key = f"photo:{photo_name}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    resp = await client.get(
        PHOTO_URL.format(name=photo_name),
        params={"key": API_KEY, "maxWidthPx": width, "skipHttpRedirect": "true"},
        timeout=30,
    )
    if resp.status_code == 404:
        logger.warning("Photo %s kadaluarsa/404", photo_name)
        return None
    resp.raise_for_status()

    photo_uri = resp.json().get("photoUri")
    if photo_uri:
        cache.set(cache_key, photo_uri)
    return photo_uri


async def resolve_photo_urls(client: httpx.AsyncClient, photo_names: list[str], limit: int = 5) -> list[str]:
    """Resolve daftar photo names -> URL, toleran error (foto 404 dilewati)."""
    urls = []
    for name in (photo_names or [])[:limit]:
        try:
            url = await get_photo_url(client, name)
            if url:
                urls.append(url)
        except httpx.HTTPError as e:
            logger.warning("Gagal resolve photo %s: %s", name, e)
    return urls
