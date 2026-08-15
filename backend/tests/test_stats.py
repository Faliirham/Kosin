from app.models import Kos
from app.routers.stats import PRICE_ORDER, build_stats


def make_kos(**overrides):
    defaults = dict(
        name="Kos Test",
        source="gmaps",
        city=None,
        district=None,
        rating=None,
        price_range=None,
    )
    defaults.update(overrides)
    return Kos(**defaults)


def test_build_stats_empty():
    s = build_stats([])
    assert s["total"] == 0
    assert s["city_count"] == 0
    assert s["cities"] == []
    assert s["avg_rating"] == 0
    assert s["rated_count"] == 0
    assert s["price_distribution"] == {p: 0 for p in PRICE_ORDER}
    assert s["source_counts"] == {"gmaps": 0, "osm": 0}


def test_build_stats_aggregates_counts_and_averages():
    rows = [
        make_kos(city="Bandung", rating=4, price_range="Mahal"),
        make_kos(city="Bandung", rating=5, price_range="Mahal"),
        make_kos(city="Jakarta", rating=None, price_range="Sedang", source="osm"),
        make_kos(city=None, price_range=None),
    ]
    s = build_stats(rows)
    assert s["total"] == 4
    assert s["city_count"] == 2
    assert s["cities"] == ["Bandung", "Jakarta"]
    assert s["avg_rating"] == 4.5
    assert s["rated_count"] == 2
    assert s["price_distribution"]["Mahal"] == 2
    assert s["price_distribution"]["Sedang"] == 1
    assert s["price_distribution"]["Murah"] == 0
    assert s["source_counts"] == {"gmaps": 3, "osm": 1}


def test_build_stats_orders_cities_by_frequency():
    rows = [
        make_kos(city="Bandung"),
        make_kos(city="Bandung"),
        make_kos(city="Jakarta"),
        make_kos(city="Jakarta"),
        make_kos(city="Surabaya"),
    ]
    s = build_stats(rows)
    assert s["cities"] == ["Bandung", "Jakarta", "Surabaya"]


def test_build_stats_uses_default_source_osm_when_missing():
    rows = [Kos(name="Anonim", source=None)]
    s = build_stats(rows)
    assert s["source_counts"] == {"gmaps": 0, "osm": 1}
