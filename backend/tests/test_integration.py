import uuid
from datetime import datetime

import httpx
import pytest
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.models import Kos
from app.routers import kos as kos_router
from app.routers import scraper as scraper_router
from app.schemas import KosCreate


def _seed(db, items):
    db.add_all(items)
    return items


async def _scrape(client, payload):
    return await client.post("/api/scrape", json=payload)


def _stub_scrape(monkeypatch, data):
    async def fake_scrape_kos(**kwargs):
        return data

    monkeypatch.setattr(scraper_router, "scrape_kos", fake_scrape_kos)


# ── Scrape upsert & dedup ─────────────────────────────────────────


@pytest.mark.asyncio
async def test_scrape_upsert_inserts_new_rows(client, db_session, monkeypatch):
    data = [
        KosCreate(name="Kos A", place_id="ChIJa", city="Bandung", district="Kec. Coblong", rating=4.0),
        KosCreate(name="Kos B", place_id="ChIJb", city="Bandung", district="Kec. Coblong"),
    ]
    _stub_scrape(monkeypatch, data)

    res = await _scrape(client, {"city": "Bandung"})

    assert res.status_code == 200
    body = res.json()
    assert body["total_scraped"] == 2
    assert len(body["areas"]) == 1
    assert body["areas"][0]["district"] == "Kec. Coblong"
    assert body["areas"][0]["count"] == 2
    rows = (await db_session.execute(select(Kos))).scalars().all()
    assert len(rows) == 2


@pytest.mark.asyncio
async def test_scrape_upsert_refreshes_existing_rows(client, db_session, monkeypatch):
    data = [
        KosCreate(name="Kos A", place_id="ChIJa", city="Bandung", district="Kec. Coblong", rating=4.0),
        KosCreate(name="Kos B", place_id="ChIJb", city="Bandung", district="Kec. Coblong"),
    ]
    _stub_scrape(monkeypatch, data)
    await _scrape(client, {"city": "Bandung"})

    refreshed = [
        KosCreate(name="Kos A", place_id="ChIJa", city="Bandung", district="Kec. Coblong", rating=4.5),
        KosCreate(name="Kos B", place_id="ChIJb", city="Bandung", district="Kec. Coblong", phone="0811"),
    ]
    _stub_scrape(monkeypatch, refreshed)
    res = await _scrape(client, {"city": "Bandung"})

    assert res.status_code == 200
    assert res.json()["total_scraped"] == 0
    rows = (await db_session.execute(select(Kos))).scalars().all()
    assert len(rows) == 2  # tanpa duplikat
    by_id = {k.place_id: k for k in rows}
    assert by_id["ChIJa"].rating == 4.5
    assert by_id["ChIJb"].phone == "0811"


@pytest.mark.asyncio
async def test_scrape_rejects_invalid_radius(client, monkeypatch):
    _stub_scrape(monkeypatch, [])
    res = await _scrape(client, {"city": "Bandung", "radius_km": -5})
    assert res.status_code == 422
    res = await _scrape(client, {"city": "Bandung", "radius_km": 50_000})
    assert res.status_code == 422
    res = await _scrape(client, {"city": "Bandung", "radius_km": 12})
    assert res.status_code == 200
    assert res.json()["total_scraped"] == 0


@pytest.mark.asyncio
async def test_unique_place_id_index_blocks_duplicates(db_session):
    db_session.add(Kos(name="Kos A", place_id="ChIJa", source="gmaps"))
    await db_session.flush()
    db_session.add(Kos(name="Kos A dupe", place_id="ChIJa", source="gmaps"))
    with pytest.raises(IntegrityError):
        await db_session.flush()


# ── List kos: filter & pagination ─────────────────────────────────


@pytest.mark.asyncio
async def test_list_kos_filters_city_search_rating(client, db_session):
    _seed(
        db_session,
        [
            Kos(name="Kos Melati", city="Bandung", district="Kec. Coblong", rating=4.5),
            Kos(name="Kos Mawar", city="Bandung", district="Kec. Cidadap", rating=3.0),
            Kos(name="Kos Anggrek", city="Jakarta", district="Kec. Menteng", rating=4.8),
        ],
    )
    await db_session.commit()

    res = await client.get("/api/kos", params={"city": "Bandung"})
    assert res.json()["total"] == 2

    res = await client.get("/api/kos", params={"search": "Mawar"})
    assert res.json()["total"] == 1
    assert res.json()["data"][0]["name"] == "Kos Mawar"

    res = await client.get("/api/kos", params={"min_rating": 4.0})
    assert res.json()["total"] == 2

    res = await client.get("/api/kos", params={"district": "Menteng"})
    assert res.json()["total"] == 1
    assert res.json()["data"][0]["name"] == "Kos Anggrek"


@pytest.mark.asyncio
async def test_list_kos_filters_by_favorite_ids(client, db_session):
    items = _seed(
        db_session,
        [
            Kos(name="Kos Melati", city="Bandung"),
            Kos(name="Kos Mawar", city="Bandung"),
            Kos(name="Kos Anggrek", city="Jakarta"),
        ],
    )
    await db_session.commit()

    res = await client.get("/api/kos", params={"favorite_ids": f"{items[0].id},{items[2].id}"})
    assert res.status_code == 200
    body = res.json()
    assert body["total"] == 2
    assert {k["name"] for k in body["data"]} == {"Kos Melati", "Kos Anggrek"}

    res = await client.get("/api/kos", params={"favorite_ids": ""})
    assert res.status_code == 200
    assert res.json()["total"] == 0


@pytest.mark.asyncio
async def test_list_kos_pagination_is_stable_with_ties(client, db_session):
    now = datetime.utcnow()
    _seed(db_session, [Kos(name=f"Kos {i}", city="Bandung", created_at=now) for i in range(5)])
    await db_session.commit()

    pages = []
    for offset in (0, 2, 4):
        res = await client.get("/api/kos", params={"limit": 2, "offset": offset, "sort": "created_at", "order": "desc"})
        assert res.status_code == 200
        pages.append([k["id"] for k in res.json()["data"]])

    ids = pages[0] + pages[1] + pages[2]
    assert len(set(pages[0]) & set(pages[1])) == 0
    assert len(set(pages[0]) & set(pages[2])) == 0
    assert len(ids) == 5
    # created_at sama → urutan ditentukan tiebreaker id (desc) secara deterministik
    assert ids == sorted(ids, reverse=True)


# ── Detail & enrichment ───────────────────────────────────────────


@pytest.mark.asyncio
async def test_enrich_gmaps_preserves_zero_and_missing_values(client, db_session, monkeypatch):
    kos = Kos(name="Kos A", place_id="ChIJa", source="gmaps", rating=4.2, total_reviews=10, phone="0811")
    db_session.add(kos)
    await db_session.commit()

    detail = {
        "name": "Kos A",
        "address": "Jl. X",
        "rating": 0.0,
        "total_reviews": 0,
        "phone": None,
        "price_level": 0,
        "photos": [],
    }

    async def fake_details(client_http, place_id):
        return detail

    async def fake_photos(client_http, photos, limit=5):
        return []

    monkeypatch.setattr("app.routers.kos.places.get_place_details", fake_details)
    monkeypatch.setattr("app.routers.kos.places.resolve_photo_urls", fake_photos)

    res = await client.get(f"/api/kos/{kos.id}")

    assert res.status_code == 200
    body = res.json()
    assert body["rating"] == 0.0  # nilai 0 tidak ditimpa data basi
    assert body["total_reviews"] == 0
    assert body["phone"] == "0811"  # None tidak menimpa data lama
    assert body["price_range"] == "Murah"  # price_level 0 → Murah


@pytest.mark.asyncio
async def test_delete_kos_and_missing_returns_404(client, db_session):
    kos = Kos(name="Kos A", city="Bandung")
    db_session.add(kos)
    await db_session.commit()

    res = await client.delete(f"/api/kos/{kos.id}")
    assert res.status_code == 200
    assert res.json()["message"] == "Kos berhasil dihapus"
    assert (
        await db_session.execute(select(Kos).where(Kos.id == kos.id))
    ).scalar_one_or_none() is None

    res = await client.delete(f"/api/kos/{uuid.uuid4()}")
    assert res.status_code == 404