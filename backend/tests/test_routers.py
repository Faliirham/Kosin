import httpx
import pytest
from fastapi import HTTPException

from app.routers.kos import _escape_like


def test_escape_like_wildcards():
    assert _escape_like("100% murah") == r"100\% murah"
    assert _escape_like("a_b") == r"a\_b"
    assert _escape_like("plain") == "plain"
    assert _escape_like(r"back\slash") == r"back\\slash"


def test_escape_like_combined():
    assert _escape_like("%_%") == r"\%\_\%"


@pytest.mark.asyncio
async def test_scrape_403_returns_clear_error(monkeypatch):
    from app.routers import scraper as scraper_router

    async def boom(*args, **kwargs):
        raise httpx.HTTPStatusError(
            "403 Forbidden",
            request=httpx.Request("POST", "https://places.googleapis.com/"),
            response=httpx.Response(403),
        )

    monkeypatch.setattr(scraper_router, "scrape_kos", boom)

    with pytest.raises(HTTPException) as exc_info:
        await scraper_router.trigger_scrape(
            scraper_router.ScrapeRequest(city="Bandung"),
            db=None,  # tidak pernah tercapai karena scrape gagal dulu
        )
    assert exc_info.value.status_code == 502
    assert "403" in exc_info.value.detail
    assert "billing" in exc_info.value.detail


@pytest.mark.asyncio
async def test_scrape_missing_key_error(monkeypatch):
    from app.routers import scraper as scraper_router

    async def boom(*args, **kwargs):
        raise RuntimeError("GOOGLE_MAPS_API_KEY belum dikonfigurasi")

    monkeypatch.setattr(scraper_router, "scrape_kos", boom)

    with pytest.raises(HTTPException) as exc_info:
        await scraper_router.trigger_scrape(
            scraper_router.ScrapeRequest(city="Bandung"),
            db=None,
        )
    assert exc_info.value.status_code == 502
    assert "GOOGLE_MAPS_API_KEY" in exc_info.value.detail
