import os
import googlemaps
from dotenv import load_dotenv

from app.schemas import KosCreate

load_dotenv()


def _get_client():
    key = os.getenv("GOOGLE_MAPS_API_KEY", "")
    if key and key != "your_api_key_here":
        return googlemaps.Client(key=key)
    return None


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
            google_maps_url="https://maps.google.com",
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
            google_maps_url="https://maps.google.com",
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
            google_maps_url="https://maps.google.com",
        ),
    ]


async def scrape_kos(city: str, keyword: str = "kos kosan") -> list[KosCreate]:
    client = _get_client()
    if not client:
        return _mock_data(city)

    results = []
    query = f"{keyword} di {city}"
    page_token = None

    for _ in range(3):
        params = {
            "query": query,
            "language": "id",
            "region": "id",
        }
        if page_token:
            params["page_token"] = page_token

        places = client.places(**params)

        for place in places.get("results", []):
            place_id = place.get("place_id")
            details = client.place(
                place_id,
                fields=[
                    "name", "formatted_address", "geometry", "rating",
                    "user_ratings_total", "formatted_phone_number", "website",
                    "opening_hours", "url", "photos", "price_level",
                ],
            )
            detail = details.get("result", {})

            photos_data = None
            if detail.get("photos"):
                photos_data = [
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={p['photo_reference']}&key={os.getenv('GOOGLE_MAPS_API_KEY')}"
                    for p in detail["photos"][:5]
                ]

            hours_data = None
            if detail.get("opening_hours"):
                hours_data = detail["opening_hours"].get("weekday_text")

            price_map = {0: "Gratis", 1: "Murah", 2: "Sedang", 3: "Mahal", 4: "Sangat Mahal"}
            price_level = detail.get("price_level")
            price_range = price_map.get(price_level) if price_level is not None else None

            kos = KosCreate(
                name=detail.get("name", ""),
                address=detail.get("formatted_address"),
                city=city,
                latitude=detail.get("geometry", {}).get("location", {}).get("lat"),
                longitude=detail.get("geometry", {}).get("location", {}).get("lng"),
                rating=detail.get("rating"),
                total_reviews=detail.get("user_ratings_total"),
                phone=detail.get("formatted_phone_number"),
                website=detail.get("website"),
                opening_hours=hours_data,
                price_range=price_range,
                photos=photos_data,
                google_maps_url=detail.get("url"),
            )
            results.append(kos)

        page_token = places.get("next_page_token")
        if not page_token:
            break

    return results
