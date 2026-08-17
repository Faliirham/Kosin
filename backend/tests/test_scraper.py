import math

import httpx
import pytest

from app import places
from app.scraper import (
    _bounds_around,
    _expand_keywords,
    _extract_city,
    _extract_district,
    _geocode_city,
    _haversine_km,
    _place_to_kos,
    split_bounds,
)


def test_haversine_bandung_jakarta_distance():
    d = _haversine_km(-6.9175, 107.6191, -6.2088, 106.8456)
    assert 100 < d < 140


def test_expand_keywords_default_uses_variants(monkeypatch):
    monkeypatch.setattr(
        "app.scraper.SCRAPE_KEYWORDS", ["kos", "kost", "kosan", "indekos", "rumah kos"]
    )
    kws = _expand_keywords("kos kosan")
    assert kws == ["kos", "kost", "kosan", "indekos", "rumah kos"]


def test_expand_keywords_custom_prepended(monkeypatch):
    monkeypatch.setattr("app.scraper.SCRAPE_KEYWORDS", ["kos", "kost"])
    kws = _expand_keywords("kos putri murah")
    assert kws[0] == "kos putri murah"
    assert kws[1:] == ["kos", "kost"]


def test_expand_keywords_custom_not_duplicated(monkeypatch):
    monkeypatch.setattr("app.scraper.SCRAPE_KEYWORDS", ["kos", "kost", "kosan"])
    kws = _expand_keywords("Kos")
    assert kws == ["kos", "kost", "kosan"]


def test_expand_keywords_empty_falls_back(monkeypatch):
    monkeypatch.setattr("app.scraper.SCRAPE_KEYWORDS", [])
    assert _expand_keywords("kos kosan") == ["kos kosan"]


def test_haversine_zero_for_same_point():
    assert _haversine_km(-6.9, 107.6, -6.9, 107.6) == 0


def test_bounds_around_centers_and_sized():
    b = _bounds_around({"lat": -6.9175, "lng": 107.6191}, 12.0)
    assert b["north"] > b["south"]
    assert b["east"] > b["west"]
    assert math.isclose(b["north"] - b["south"], 24.0 / 111.0)


def test_split_bounds_1x1_returns_copy():
    b = {"south": -7.0, "north": -6.0, "west": 107.0, "east": 108.0}
    cells = split_bounds(b, 1)
    assert len(cells) == 1
    assert cells[0] == b


def test_split_bounds_2x2_contiguous_no_gaps():
    b = {"south": -7.0, "north": -6.0, "west": 107.0, "east": 109.0}
    cells = split_bounds(b, 2)
    assert len(cells) == 4
    assert sorted({c["south"] for c in cells}) == [-7.0, -6.5]
    assert sorted({c["west"] for c in cells}) == [107.0, 108.0]
    assert all(math.isclose(c["north"], c["south"] + 0.5) for c in cells)
    assert all(math.isclose(c["east"], c["west"] + 1.0) for c in cells)


def test_split_bounds_clamps_invalid_grid():
    b = {"south": -7.0, "north": -6.0, "west": 107.0, "east": 108.0}
    assert len(split_bounds(b, 0)) == 1
    assert len(split_bounds(b, -3)) == 1


def test_extract_city_recognizes_kota_and_kabupaten():
    addr = "Jl. Sudirman No. 5, Kec. Coblong, Kota Bandung, Jawa Barat, Indonesia"
    assert _extract_city(addr, "Bandung") == "Kota Bandung"
    assert _extract_city("Ds. Cibodas, Kabupaten Bogor", "Bogor") == "Kabupaten Bogor"


def test_extract_city_rejects_road_names_containing_markers():
    addr = "Jalan Kota Baru, Kec. X, Kabupaten Bekasi, Jawa Barat"
    assert _extract_city(addr, "Bekasi") == "Kabupaten Bekasi"


def test_extract_city_falls_back():
    assert _extract_city(None, "Bandung") == "Bandung"
    assert _extract_city("Jalan Melati No. 2", "Jakarta") == "Jakarta"


def test_extract_district_variants():
    assert _extract_district("Jl. A, Kecamatan Coblong, Kota Bandung") == "Kecamatan Coblong"
    assert _extract_district("Jl. B, Kec. Cidadap, Kota Bandung") == "Kec. Cidadap"
    assert _extract_district("Jl. C, Kelurahan Dago, Kota Bandung") == "Kelurahan Dago"
    assert _extract_district("Jl. D, Kel. Ciumbuleuit, Kota Bandung") == "Kel. Ciumbuleuit"


def test_extract_district_none():
    assert _extract_district(None) is None
    assert _extract_district("Jl. Sudirman, Kota Bandung") is None


def test_place_to_kos_maps_all_fields():
    place = {
        "place_id": "abc",
        "name": "Kos Melati",
        "address": "Jl. Dago No. 1, Kec. Cidadap, Kota Bandung, Jawa Barat",
        "latitude": -6.8,
        "longitude": 107.6,
        "rating": 4.5,
        "total_reviews": 10,
        "phone": "0812-111",
        "website": "https://x.com",
        "opening_hours": ["Senin: 08.00-17.00"],
        "price_level": 3,
        "photos": ["places/p1"],
        "google_maps_url": "https://maps.google.com",
    }
    kos = _place_to_kos(place, "Bandung")
    assert kos.source == "gmaps"
    assert kos.name == "Kos Melati"
    assert kos.city == "Kota Bandung"
    assert kos.district == "Kec. Cidadap"
    assert kos.price_range == "Mahal"
    assert kos.place_id == "abc"
    assert kos.rating == 4.5


def test_place_to_kos_missing_fields_defaulted():
    kos = _place_to_kos({"name": None, "address": None}, "Bandung")
    assert kos.name == "Tanpa Nama"
    assert kos.city == "Bandung"
    assert kos.district is None
    assert kos.price_range is None
    assert kos.rating is None


async def test_geocode_city_google_success():
    def handler(request):
        assert "maps.googleapis.com" in str(request.url)
        return httpx.Response(
            200,
            json={
                "status": "OK",
                "results": [
                    {
                        "geometry": {
                            "location": {"lat": -6.9, "lng": 107.6},
                            "viewport": {
                                "northeast": {"lat": -6.5, "lng": 108.0},
                                "southwest": {"lat": -7.3, "lng": 107.2},
                            },
                        }
                    }
                ],
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        geo = await _geocode_city(client, "Bandung")
    assert geo["center"] == {"lat": -6.9, "lng": 107.6}
    assert geo["bounds"]["north"] == -6.5
    assert geo["bounds"]["south"] == -7.3


async def test_geocode_city_google_zero_results_falls_back_to_nominatim():
    def handler(request):
        if "googleapis.com" in str(request.url):
            return httpx.Response(200, json={"status": "ZERO_RESULTS"})
        return httpx.Response(
            200,
            json=[
                {
                    "lat": "-6.9",
                    "lon": "107.6",
                    "boundingbox": ["-7.5", "-6.3", "106.8", "108.4"],
                }
            ],
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        geo = await _geocode_city(client, "Bandung")
    assert geo["center"] == {"lat": -6.9, "lng": 107.6}
    assert geo["bounds"]["south"] == -7.5


async def test_geocode_city_all_sources_fail_uses_fallback_table():
    def handler(request):
        return httpx.Response(500, text="boom")

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        geo = await _geocode_city(client, "Bandung")
    assert geo["center"] == {"lat": -6.9175, "lng": 107.6191}
    assert geo["bounds"]["north"] > geo["bounds"]["south"]


async def test_geocode_city_unknown_location_raises():
    def handler(request):
        return httpx.Response(500, text="boom")

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(RuntimeError):
            await _geocode_city(client, "Kota yang tidak dikenal XYZ")


async def test_search_places_hits_cache_second_time(monkeypatch):
    monkeypatch.setattr(places, "API_KEY", "test-key")
    places.cache.clear()
    calls = {"n": 0}

    def handler(request):
        calls["n"] += 1
        return httpx.Response(
            200,
            json={
                "places": [
                    {
                        "id": "p1",
                        "displayName": {"text": "Kos A"},
                        "formattedAddress": "Jl. A, Kota Bandung",
                    }
                ]
            },
        )

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        first = await places.search_places(client, "Bandung", "kos")
        second = await places.search_places(client, "Bandung", "kos")
    assert first == second
    assert len(first) == 1
    assert first[0]["name"] == "Kos A"
    assert calls["n"] == 1