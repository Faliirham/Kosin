import httpx
import pytest

from app import places


def test_price_level_to_range():
    assert places.price_level_to_range(0) == "Murah"
    assert places.price_level_to_range(1) == "Murah"
    assert places.price_level_to_range(2) == "Sedang"
    assert places.price_level_to_range(3) == "Mahal"
    assert places.price_level_to_range(4) == "Sangat Mahal"
    assert places.price_level_to_range(99) == "Sedang"
    assert places.price_level_to_range(None) is None


def test_normalize_place_full():
    place = {
        "id": "pid",
        "displayName": {"text": "Kos X"},
        "formattedAddress": "Jl. A, Kota Bandung",
        "location": {"latitude": -6.9, "longitude": 107.6},
        "rating": 4.2,
        "userRatingCount": 7,
        "nationalPhoneNumber": "0812",
        "websiteUri": "https://w.com",
        "regularOpeningHours": {"weekdayDescriptions": ["Senin: 08.00-17.00"]},
        "priceLevel": 2,
        "photos": [{"name": "places/abc"}],
        "googleMapsUri": "https://maps.google.com",
    }
    n = places._normalize_place(place)
    assert n["place_id"] == "pid"
    assert n["name"] == "Kos X"
    assert n["latitude"] == -6.9
    assert n["rating"] == 4.2
    assert n["photos"] == ["places/abc"]
    assert n["opening_hours"] == ["Senin: 08.00-17.00"]
    assert n["price_level"] == 2
    assert n["google_maps_url"] == "https://maps.google.com"


def test_normalize_place_sparse():
    n = places._normalize_place({"id": "p", "displayName": {"text": "K"}})
    assert n["name"] == "K"
    assert n["photos"] is None
    assert n["opening_hours"] is None
    assert n["latitude"] is None
    assert n["address"] is None


def test_bounds_key():
    assert places._bounds_key(None) == "all"
    assert (
        places._bounds_key({"south": -7, "west": 107, "north": -6, "east": 108})
        == "-7.00000,107.00000,-6.00000,108.00000"
    )


def test_raise_if_unavailable(monkeypatch):
    monkeypatch.setattr(places, "API_KEY", "")
    with pytest.raises(RuntimeError):
        places._raise_if_unavailable()
    monkeypatch.setattr(places, "API_KEY", "your_api_key_here")
    with pytest.raises(RuntimeError):
        places._raise_if_unavailable()
    monkeypatch.setattr(places, "API_KEY", "valid-key")
    places._raise_if_unavailable()


def test_ttl_cache_roundtrip_and_missing():
    c = places.TTLCache()
    assert c.get("nope") is None
    c.set("a", {"x": 1})
    assert c.get("a") == {"x": 1}


def test_ttl_cache_expiry(monkeypatch):
    fake_now = [1000.0]
    monkeypatch.setattr(places.time, "time", lambda: fake_now[0])
    c = places.TTLCache(ttl=10)
    c.set("k", "v")
    fake_now[0] = 1009.0
    assert c.get("k") == "v"
    fake_now[0] = 1011.0
    assert c.get("k") is None


def test_ttl_cache_clear():
    c = places.TTLCache()
    c.set("a", 1)
    c.clear()
    assert c.get("a") is None


async def test_place_details_404_returns_none(monkeypatch):
    monkeypatch.setattr(places, "API_KEY", "k")
    places.cache.clear()
    async with httpx.AsyncClient(transport=httpx.MockTransport(lambda r: httpx.Response(404))) as client:
        assert await places.get_place_details(client, "missing") is None


async def test_place_details_cached(monkeypatch):
    monkeypatch.setattr(places, "API_KEY", "k")
    places.cache.clear()
    calls = {"n": 0}

    def handler(request):
        calls["n"] += 1
        return httpx.Response(200, json={"id": "p", "displayName": {"text": "Kos B"}})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        first = await places.get_place_details(client, "p")
        second = await places.get_place_details(client, "p")
    assert first == second
    assert first["name"] == "Kos B"
    assert calls["n"] == 1


async def test_resolve_photo_urls_tolerates_404(monkeypatch):
    monkeypatch.setattr(places, "API_KEY", "k")
    places.cache.clear()

    def handler(request):
        url = str(request.url)
        if "places/ok/media" in url or "places%2Fok%2Fmedia" in url:
            return httpx.Response(200, json={"photoUri": "https://img.example/1"})
        return httpx.Response(404)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        urls = await places.resolve_photo_urls(client, ["places/ok", "places/gone"])
    assert urls == ["https://img.example/1"]