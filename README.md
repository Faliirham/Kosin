<div align="center">

# 🏠 Kosin — Kos Finder

**Platform pencarian kos-kosan dengan data Google Maps (geocode fallback OSM)**

Sebuah full-stack web application yang mencari kos-kosan via **Google Places API**, menyimpannya ke PostgreSQL, dan menampilkannya dalam dashboard interaktif dengan peta **Google Maps JavaScript API**.

![Stack](https://img.shields.io/badge/Frontend-Vue%203%20%2F%20Vite-42b883)
![Stack](https://img.shields.io/badge/Backend-FastAPI-009688)
![Stack](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Stack](https://img.shields.io/badge/Data-Google%20Places%20%2F%20OSM-4285f4)

</div>

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Arsitektur](#️-arsitektur)
- [Struktur Project](#-struktur-project)
- [Tech Stack](#-tech-stack)
- [Persyaratan](#️-persyaratan)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Reference](#-api-reference)
- [Data Model](#-data-model)
- [Roadmap](#-roadmap)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🔍 **Scraping Otomatis** | Mengambil data kos-kosan via **Google Places API** (utama) dengan fallback OpenStreetMap |
| ⭐ **Data Kaya Rating** | Rating, jumlah ulasan, telepon, website, jam buka, & rentang harga dari Google |
| 📸 **Live Photo Fetch** | Foto kos di-resolve real-time dengan cache ≤ 24 jam (sesuai ToS Google) |
| 🗺️ **Map View** | Visualisasi lokasi kos-kosan menggunakan Google Maps JavaScript API |
| 🔎 **Pencarian** | Cari kos berdasarkan nama / alamat / kota / kecamatan dengan hasil real-time |
| 🏘️ **Filter Kecamatan** | Scrape & filter berdasarkan kota dan kecamatan/kelurahan |
| ⭐ **Filter Rating** | Filter berdasarkan minimal rating (2+, 3+, 4+, 4.5+) |
| 📊 **Sorting** | Urutkan berdasarkan terbaru, rating, atau nama |
| 📄 **Halaman Detail** | Info lengkap: alamat, kecamatan, kontak, jam buka, website, foto, rating |
| 💾 **Penyimpanan Persisten** | Data tersimpan di PostgreSQL dengan auto-deduplication & refresh otomatis saat re-scrape |
| 📱 **Responsive** | Tampilan adaptif & modern untuk desktop & mobile |

---

## 🏗️ Arsitektur

```
┌──────────────────────┐         ┌─────────────────────────────┐
│   Frontend (Vue 3)   │  HTTP   │     Backend (FastAPI)       │
│                      │ ──────► │                             │
│  ┌────────────────┐  │  REST   │  ┌───────────────────────┐  │
│  │ Dashboard      │  │  API    │  │ Scraper Module        │  │
│  │  - Peta        │  │         │  │  - Google Places  🥇   │  │
│  │  - Filter      │  ◄───────  │  │  - Geocode Fallback 🥈 │  │
│  │  - Detail      │  │         │  │  - OSM / Nominatim     │  │
│  └────────────────┘  │         │  └──────────┬────────────┘  │
│        Vite:5173     │         │             │               │
│                      │         │  ┌──────────▼────────────┐  │
│                      │         │  │   PostgreSQL 17       │  │
│                      │         │  │   (SQLAlchemy/async)  │  │
│                      │         │  └───────────────────────┘  │
└──────────────────────┘         └─────────────────────────────┘
        (Proxy /api → :8000)                FastAPI:8000
```

### Alur Kerja

1. User membuka dashboard dan memilih **kota** (opsional: kecamatan/kelurahan)
2. Frontend mengirim request `POST /api/scrape` ke backend
3. Backend mencari kos-kosan via **Google Places API** (Text Search, bias lokasi dari geocode: Google Geocoding → Nominatim → tabel kota umum)
4. Data dinormalisasi & di-deduplicate (berbasis `place_id`); jika data sudah ada, field-nya di-**refresh**; jika baru, di-insert ke **PostgreSQL**
5. Opsional: saat request `GET /api/kos/{id}`, detail Google (rating, ulasan, foto) di-**live-fetch** dengan cache ≤ 24 jam
6. Frontend menampilkan hasil sebagai **kartu** dan **marker di peta**
7. User dapat klik kartu untuk melihat **detail lengkap** kos-kosan

> 🌐 Sumber data kos **murni Google Places**. Geocode lokasi memakai rantai fallback **Google Geocoding → Nominatim (OpenStreetMap) → tabel kota umum** — sehingga scrape tetap berjalan walau billing Google nonaktif.

---

## 📁 Struktur Project

```
kosin/
├── backend/                         # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI entry point, CORS, router registration, migrasi ringan
│   │   ├── database.py              # Koneksi PostgreSQL async (SQLAlchemy)
│   │   ├── models.py                # ORM model tabel `kos`
│   │   ├── schemas.py               # Pydantic schemas (request/response)
│   │   ├── places.py                # Google Places client (Text Search, Details, Photos, cache 24 jam)
│   │   ├── scraper.py               # Scraper engine (Google Places + geocode fallback Nominatim)
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── scraper.py           # POST /api/scrape
│   │       └── kos.py               # GET/DELETE /api/kos
│   ├── .env                         # Environment variables (jangan di-commit!)
│   └── requirements.txt             # Dependencies Python
│
├── frontend/                        # Vue 3 frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js               # Konfigurasi Vite + proxy /api
│   └── src/
│       ├── main.js                  # Vue app bootstrap
│       ├── App.vue                  # Root component + routing sederhana
│       ├── services/
│       │   └── api.js               # Axios client ke backend
│       ├── components/
│       │   ├── FilterBar.vue        # Form scrape + filter/sort
│       │   ├── KosCard.vue          # Kartu ringkasan kos
│       │   └── MapView.vue          # Peta Google Maps dengan markers
│       └── views/
│           ├── Dashboard.vue        # Halaman utama (list + map)
│           └── DetailKos.vue        # Detail lengkap kos-kosan
│
└── README.md
```

---

## 🧰 Tech Stack

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Python](https://www.python.org/) | 3.11+ | Bahasa pemrograman utama |
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115 | Web framework async |
| [SQLAlchemy](https://www.sqlalchemy.org/) | 2.0 | ORM database |
| [asyncpg](https://magicstack.github.io/asyncpg/) | 0.30 | PostgreSQL driver async |
| [httpx](https://www.python-httpx.org/) | 0.28 | HTTP client (Google Places, Geocoding & Nominatim) |
| [Pydantic](https://docs.pydantic.dev/) | 2.10 | Validasi & serialisasi data |
| [uvicorn](https://www.uvicorn.org/) | 0.34 | ASGI server |

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Vue 3](https://vuejs.org/) | 3.5 | JavaScript framework |
| [Vite](https://vite.dev/) | 6.0 | Build tool & dev server |
| [Axios](https://axios-http.com/) | 1.7 | HTTP client |
| [Google Maps JS API](https://developers.google.com/maps/documentation/javascript) | — | Map library (via `@googlemaps/js-api-loader`) |

### Database
| Teknologi | Versi |
|-----------|-------|
| [PostgreSQL](https://www.postgresql.org/) | 14+ (tested on 17) |

### Sumber Data
| Teknologi | Fungsi |
|-----------|--------|
| [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service/overview) | **Sumber data utama**: Text Search, Place Details, Place Photos — rating, ulasan, foto, telepon |
| [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding) | Geocode nama kota/kecamatan menjadi koordinat & bounding box |
| [Nominatim](https://nominatim.openstreetmap.org/) | Fallback geocode saat Google Geocoding tidak tersedia (billing nonaktif / offline) |

> Data kos © Google Maps; geocode fallback © OpenStreetMap contributors (lisensi [ODbL](https://www.openstreetmap.org/copyright)) — atribusi sudah ditampilkan di footer aplikasi.

---

## ⚙️ Persyaratan

Sebelum memulai, pastikan sudah terinstal:

| Software | Minimum |
|----------|---------|
| [Python](https://www.python.org/downloads/) | 3.11 |
| [Node.js](https://nodejs.org/) | 18+ |
| [PostgreSQL](https://www.postgresql.org/download/) | 14+ |

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Faliirham/Kosin.git
cd Kosin
```

### 2. Setup Backend

```bash
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan (Windows)
.\venv\Scripts\activate

# Aktifkan (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Setup Database

Buat database PostgreSQL baru:

```bash
# Windows (sesuaikan path instalasi PostgreSQL)
createdb -U postgres kos_finder

# atau via psql
psql -U postgres -c "CREATE DATABASE kos_finder;"
```

> 💡 Tabel `kos` otomatis dibuat saat backend pertama kali dijalankan (auto-create via SQLAlchemy).

---

## 🔧 Konfigurasi

### Environment Variables

Copy `.env.example` menjadi `.env` lalu isi nilainya:

```bash
cd backend
cp .env.example .env
```

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DATABASE_URL` | Koneksi PostgreSQL | `postgresql+asyncpg://postgres:admin@localhost:5432/kos_finder` |
| `GOOGLE_MAPS_API_KEY` | API key Google Places & Geocoding (server-side only!) | `AIza...` |

### Frontend Environment (`frontend/.env`)

```bash
cd frontend
cp .env.example .env
```

| Variable | Deskripsi |
|----------|-----------|
| `VITE_GOOGLE_MAPS_KEY` | API key Google Maps JavaScript API (browser) — restrict **by HTTP referrer** |

> ⚠️ **Keamanan key Google**: key Places/Geocoding hanya dipakai di backend (server-side), **jangan pernah** diekspos ke browser. Key Maps (browser) dipakai frontend — restrict by referrer `http://localhost:5173` + domain produksi.
>
> 📸 **Foto**: endpoint Place Photos memerlukan billing aktif. Selama billing nonaktif, data rating/ulasan tetap berfungsi, hanya foto kosong.
>
> 🌐 **Geocode**: bila Google Geocoding tidak tersedia (billing nonaktif / key invalid), scraper otomatis fallback ke **Nominatim (OSM)** lalu **tabel kota umum** — scraping tetap jalan tanpa billing.

---

## ▶️ Menjalankan Aplikasi

### Jalankan Backend

```bash
cd backend
.\venv\Scripts\uvicorn app.main:app --reload --port 8000
```

Backend berjalan di **http://localhost:8000**
- Interactive API docs (Swagger): **http://localhost:8000/docs**
- Alternative docs (Redoc): **http://localhost:8000/redoc**
- Health check: **http://localhost:8000/api/health**

### Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend berjalan di **http://localhost:5173**

Vite meng-proxy request `/api/*` ke backend `localhost:8000`, jadi tidak perlu konfigurasi tambahan.

### Cara Pakai

1. Buka `http://localhost:5173`
2. Masukkan **kota** (contoh: Bandung, Jakarta, Surabaya) — opsional **kecamatan/kelurahan**
3. Klik tombol **Scrape**
4. Hasil kos-kosan muncul sebagai kartu + marker di peta
5. Klik kartu untuk melihat **detail lengkap**
6. Gunakan **filter** untuk mencari, filter rating, filter kecamatan, dan sorting

---

## 📡 API Reference

### Health Check

```
GET /api/health
```

**Response:**
```json
{ "status": "ok" }
```

---

### Trigger Scraping

```
POST /api/scrape
```

**Request Body:**

| Field | Tipe | Deskripsi | Wajib |
|-------|------|-----------|-------|
| `city` | string | Nama kota target | ✅ |
| `keyword` | string | Keyword pencarian (contoh: "kos kosan murah") | ❌ |
| `district` | string | Kecamatan/kelurahan target (contoh: "Kec. Coblong") | ❌ |
| `lat`, `lng` | number | Koordinat pusat (alternatif geocode) | ❌ |
| `radius_km` | number | Radius pencarian dalam km (default: 12) | ❌ |

**Contoh:**
```json
{
  "city": "Bandung",
  "district": "Coblong",
  "keyword": "kos kosan murah"
}
```

**Response:**
```json
{
  "message": "Scrape selesai",
  "total_scraped": 25
}
```

> 💡 `total_scraped` = jumlah baris **baru** yang diinsert. Data yang sudah ada (match `place_id`) otomatis di-**refresh** field-nya, tidak dihitung sebagai baris baru.

---

### List Kos-Kosan

```
GET /api/kos
```

**Query Parameters:**

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `city` | string | Filter berdasarkan kota (partial match) |
| `district` | string | Filter berdasarkan kecamatan/kelurahan (partial match) |
| `search` | string | Cari berdasarkan nama / alamat / kota / kecamatan (partial match) |
| `min_rating` | number | Filter rating minimum |
| `sort` | string | `created_at`, `rating`, atau `name` (default: `created_at`) |
| `order` | string | `asc` atau `desc` (default: `desc`) |
| `limit` | number | Jumlah per halaman, max 100 (default: 50) |
| `offset` | number | Offset pagination (default: 0) |

**Contoh:**
```bash
GET /api/kos?city=Bandung&min_rating=4&sort=rating&order=desc&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "75b84f7d-98e8-463d-94b0-76bad2ae5f46",
      "name": "Kos Anggrek Putih",
      "place_id": "ChIJxxxx",
      "source": "gmaps",
      "address": "Jl. Sudirman No. 5, Kec. Coblong, Bandung",
      "city": "Bandung",
      "district": "Kec. Coblong",
      "latitude": -6.9075,
      "longitude": 107.6091,
      "rating": 4.8,
      "total_reviews": 42,
      "phone": "0821-1111-2222",
      "website": "https://kosanggrek.example.com",
      "opening_hours": ["Senin: 08:00-17:00"],
      "price_range": "Mahal",
      "photos": ["https://..."],
      "google_maps_url": "https://maps.google.com",
      "created_at": "2026-07-31T01:45:11.806571"
    }
  ],
  "total": 25
}
```

> 💡 `GET /api/kos/{id}`: untuk data bersumber Google (`source=gmaps`), detail (rating, ulasan, foto, telepon) di-**live-fetch** real-time dengan cache ≤ 24 jam — database hanya menyimpan `place_id` (sesuai ToS Google).

---

### Detail Kos-Kosan

```
GET /api/kos/{id}
```

**Response:** Satu objek `Kos` (format sama seperti di atas).

**Error:**
```json
{ "detail": "Kos tidak ditemukan" }
```

---

### Hapus Kos-Kosan

```
DELETE /api/kos/{id}
```

**Response:**
```json
{ "message": "Kos berhasil dihapus" }
```

---

## 🧪 Testing

Hasil pencarian memakai **loading optimistik**: kartu kos langsung dirender dari data yang sudah ada di database sementara scrape kota baru berjalan di latar belakang (ditandai overlay "Mencari data baru…"). Skeleton hanya muncul saat fetch database berjalan atau saat kota belum punya data sama sekali — perilaku ini **identik di semua ukuran layar**; breakpoint hanya mengubah layout grid (desktop: list + map 2 kolom, mobile: 1 kolom), bukan render datanya.

```bash
cd frontend
npm run test:e2e   # Playwright — render desktop (1280px) & mobile (390px), alur scrape
```

Test meng-stub API (tanpa backend/PostgreSQL/Google) dan memverifikasi: kartu kos lengkap (foto, badge sumber, rating, alamat, chip kota/kecamatan) muncul di kedua breakpoint; skeleton hilang setelah load selesai; hasil lama tetap tampil saat scrape berjalan maupun gagal.

---

## 🗃️ Data Model

### Tabel `kos`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | `UUID` | Primary key (auto-generated) |
| `place_id` | `VARCHAR(255)` | ID tempat Google Places (untuk sumber gmaps) |
| `source` | `VARCHAR(20)` | Sumber data: `gmaps` / `osm` |
| `name` | `VARCHAR(255)` | Nama kos-kosan |
| `address` | `TEXT` | Alamat lengkap |
| `city` | `VARCHAR(100)` | Kota lokasi (hasil ekstraksi dari alamat) |
| `district` | `VARCHAR(100)` | Kecamatan/kelurahan (hasil ekstraksi dari alamat) |
| `latitude` | `FLOAT` | Koordinat latitude |
| `longitude` | `FLOAT` | Koordinat longitude |
| `rating` | `FLOAT` | Rating Google Maps (1-5) |
| `total_reviews` | `INTEGER` | Jumlah ulasan |
| `phone` | `VARCHAR(50)` | Nomor telepon |
| `website` | `VARCHAR(255)` | URL website |
| `opening_hours` | `JSON` | Jam buka (weekday_text) |
| `price_range` | `VARCHAR(100)` | Kategori harga (Murah/Sedang/Mahal) |
| `photos` | `JSON` | Array URL foto |
| `google_maps_url` | `VARCHAR(500)` | Link Google Maps |
| `created_at` | `DATETIME` | Timestamp dibuat |

---

## 🗺️ Roadmap

### ✅ Selesai

- [x] Scraping data kos-kosan murni Google Places (geocode fallback Nominatim)
- [x] Integrasi Google Places API (Text Search, Place Details, Place Photos, cache ≤ 24 jam)
- [x] Kolom `place_id` & `source`, dedup berbasis `place_id`
- [x] Dashboard dengan map view (Google Maps), filter rating & sorting
- [x] Halaman detail kos-kosan dengan live-fetch data Google
- [x] UI modern & responsif (skeleton loading, toast, badges sumber data)
- [x] Filter kota & kecamatan (scrape + list), kolom `district` di database
- [x] Refresh data otomatis saat re-scrape (update field yang sudah ada, bukan skip)
- [x] Ekstraksi kota/kecamatan dari alamat (anti-pencemaran oleh token jalan)
- [x] Geocode fallback Nominatim + tabel kota umum saat billing Google nonaktif

### 🔜 Berikutnya

- [ ] Aktifkan billing untuk Place Photos (foto saat ini kosong saat billing nonaktif)
- [ ] Pagination / multi-halaman Google Places (saat ini hanya halaman pertama hasil pencarian)
- [ ] Fitur promosi kos berbayar (featured) + form klaim owner + verifikasi admin
- [ ] Harga kos-kosan spesifik (per bulan)
- [ ] Autentikasi user
- [ ] Favorit / bookmark kos
- [ ] Pagination UI di frontend
- [ ] Jadwal scraping otomatis (cron)
- [ ] Deployment ke production
- [ ] Unit & integration testing
- [ ] CI/CD pipeline

### 🗺️ Migrasi Google Maps (lanjutan)

> Data Google Places punya kualitas lebih kaya (rating, review, foto). Arsitektur saat ini: **live-fetch** — simpan hanya `place_id`, detail di-fetch real-time dengan cache ≤ 24 jam.

- [x] Aktifkan Places API (New) + API key server-side
- [x] Client `places.py` (searchText, place details, photo media) dengan cache ≤ 24 jam
- [x] Kolom `place_id` & `source` di tabel `kos`, dedup berbasis `place_id`
- [x] Ganti peta Leaflet → Google Maps JavaScript API
- [ ] Aktifkan billing & buat API key production restrict by IP
- [ ] Evaluasi Local Lists Terms Google sebelum monetisasi skala besar

---

<div align="center">

Dibuat dengan ❤️ menggunakan **FastAPI** & **Vue 3**

</div>
