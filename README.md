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
- [Testing](#-testing)
- [API Reference](#-api-reference)
- [Data Model](#-data-model)
- [Roadmap](#-roadmap)
- [Lisensi](#-lisensi)

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🔍 **Scraping Otomatis** | Mengambil data kos-kosan via **Google Places API** (utama) dengan fallback OpenStreetMap |
| 🗺️ **Area Coverage** | Kota dipecah menjadi **grid area (N×N sel, default 2×2)** dan keyword dicari per sel — area pinggiran ikut terjangkau, hasil unik di-dedup per `place_id`; hasil banding rasio kota kecil: 60 → 100+ per kota |
| 🔎 **Multi-Keyword** | Setiap sel dicari dengan **beberapa varian keyword** (`kos`, `kost`, `kosan`, `indekos`, `rumah kos`) secara **paralel** — Google hanya mengembalikan 20 hasil paling relevan per query, jadi satu keyword saja menangkap sedikit tempat. Cakupan naik drastis tanpa duplikat (dedup `place_id`) |
| 🏘️ **Breakdown Kecamatan** | Response scrape menyertakan ringkasan jumlah kos per kecamatan; dashboard menampilkan chip area temuan |
| ⭐ **Data Kaya Rating** | Rating, jumlah ulasan, telepon, website, jam buka, & rentang harga dari Google |
| 📸 **Live Photo Fetch** | Foto kos di-resolve real-time dengan cache ≤ 24 jam (sesuai ToS Google) |
| 🗺️ **Map View** | Visualisasi lokasi kos-kosan menggunakan Google Maps JavaScript API |
| 🔎 **Pencarian** | Cari kos berdasarkan nama / alamat / kota / kecamatan dengan hasil real-time |
| 🏘️ **Filter Kecamatan** | Scrape & filter berdasarkan kota dan kecamatan/kelurahan |
| ⭐ **Filter Rating** | Filter berdasarkan minimal rating (2+, 3+, 4+, 4.5+) |
| 📊 **Sorting** | Urutkan berdasarkan terbaru, rating, atau nama |
| 📄 **Halaman Detail** | Info lengkap: alamat, kecamatan, kontak, jam buka, website, foto, rating |
| 💾 **Penyimpanan Persisten** | Data tersimpan di PostgreSQL dengan auto-deduplication & refresh otomatis saat re-scrape |
| ❤️ **Favorit Kos** | Simpan kos favorit ke `localStorage` (tanpa login) & filter khusus favorit — ikon hati di kartu, detail, dan filter bar |
| 🕘 **Riwayat Pencarian** | Pencarian terakhir tersimpan & bisa dipanggil kembali lewat chip — shortcut global `/` untuk fokus kotak pencarian |
| 💬 **Aksi Cepat Detail** | Tombol WhatsApp (`wa.me` dari nomor lokal), Petunjuk Arah (Google Maps), dan Salin Tautan dari halaman detail |
| 📥 **Ekspor CSV** | Download hasil pencarian (termasuk filter favorit) ke file CSV dengan encoding UTF-8 (BOM) siap Excel |
| ⬆️ **Kembali ke Atas** | Tombol mengambang muncul setelah scroll — klik untuk kembali ke atas halaman dengan mulus |
| 📊 **Statistik Nyata** | Landing page menampilkan agregat dari database via `GET /api/stats` (total kos, kota, rata-rata rating) |
| 🦶 **Footer Atribusi** | Footer global berisi atribusi **Google Maps © Google** & **OpenStreetMap © kontributor** (sesuai ToS) + tautan privasi/syarat |
| 📱 **Responsive** | Tampilan adaptif & modern untuk desktop & mobile — input 16px (anti zoom iOS), peta & statistik di-rapikan di layar sempit |

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
│   │       ├── kos.py               # GET/DELETE /api/kos
│   │       └── stats.py             # GET /api/stats (agregasi landing)
│   ├── tests/                       # Unit test backend (pytest)
│   │   ├── test_places.py           # Price level, normalisasi place, TTL cache, details/photos, max pages
│   │   ├── test_scraper.py          # Haversine, grid bounds, ekspansi keyword, ekstraksi kota/kecamatan, fallback geocode
│   │   ├── test_stats.py            # Agregasi build_stats (total, kota, rating, distribusi harga)
│   │   └── test_routers.py          # Escape LIKE, error mapping scrape (403/billing, key kosong)
│   ├── pytest.ini                   # Konfigurasi pytest (asyncio mode auto)
│   ├── requirements.txt             # Dependencies Python (runtime)
│   ├── requirements-dev.txt         # Dependencies pengembangan (+ pytest)
│   ├── .env                         # Environment variables (jangan di-commit!)
│   └── .env.example
│
├── frontend/                        # Vue 3 frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js               # Konfigurasi Vite + proxy /api
│   ├── vitest.config.js             # Konfigurasi unit test (Vitest + jsdom)
│   ├── playwright.config.js         # Konfigurasi e2e (Playwright, webServer vite)
│   ├── tests/                       # Semua file test — terpisah dari kode aplikasi
│   │   ├── unit/                    # Unit test (Vitest)
│   │   │   ├── api.test.js          # Client API (mock axios)
│   │   │   ├── theme.test.js        # Dark/light mode
│   │   │   ├── AppIcon.test.js      # Rendering ikon SVG
│   │   │   ├── KosCard.test.js      # Kartu kos (badge, chip, fallback foto, favorit)
│   │   │   ├── FilterBar.test.js    # Emits + debounce pencarian + riwayat
│   │   │   ├── favorites.test.js    # Store favorit localStorage (max 200, dedup id/place_id)
│   │   │   ├── history.test.js      # Store riwayat pencarian (max 5)
│   │   │   ├── contact.test.js      # phoneToWa & directionsUrl
│   │   │   ├── InfoSection.test.js  # Aksi detail (WhatsApp, arah, salin tautan, favorit)
│   │   │   └── csv.test.js          # Builder CSV (escaping, BOM, download)
│   │   └── e2e/                     # Test end-to-end (Playwright)
│   │       ├── dashboard.spec.js    # Render kartu desktop/mobile, alur scrape, error state
│   │       ├── theme.spec.js        # Toggle dark mode, persist, reload
│   │       ├── icons.spec.js        # Render ikon + lebar select di light & dark
│   │       └── chevron.spec.js      # Chevron select ikut tema
│   └── src/
│       ├── main.js                  # Vue app bootstrap
│       ├── App.vue                  # Root component + routing sederhana
│       ├── services/
│       │   ├── api.js               # Axios client ke backend
│       │   ├── theme.js             # Dark/light mode (sistem + manual, persist localStorage)
│       │   ├── favorites.js         # Store favorit kos (reactive, localStorage)
│       │   ├── history.js           # Store riwayat pencarian (reactive, localStorage)
│       │   ├── contact.js           # Helper phone→wa.me & URL petunjuk arah
│       │   └── csv.js               # Builder CSV + download file
│       ├── components/
│       │   ├── AppIcon.vue          # SVG icon set
│       │   ├── SiteHeader.vue       # Header global (nav + tema)
│       │   ├── SiteFooter.vue       # Footer global (atribusi Google/OSM + legal links)
│       │   ├── FilterBar.vue        # Form scrape + filter/sort
│       │   ├── KosCard.vue          # Kartu ringkasan kos
│       │   ├── MapView.vue          # Peta Google Maps dengan markers
│       │   ├── StateCard.vue        # State kosong/error/loading
│       │   ├── SkeletonGrid.vue     # Skeleton loader daftar kos
│       │   ├── detail/              # GallerySection, InfoSection (halaman detail)
│       │   └── landing/             # Hero, StatsBand, Features, HowItWorks, Cities, CTA
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
| [Geist](https://vercel.com/font) | — | Font display & body (via Google Fonts) |
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
| `CORS_ORIGINS` | Origin frontend yang diizinkan CORS (pisah koma) | `http://localhost:5173,https://kosin.app` |
| `SCRAPE_GRID_SIZE` | Pecah kota menjadi **N×N sel area** dan cari per sel agar area pinggiran ikut terjangkau (default `2` → 4 sel; opsional `3` → 9 sel). Mode `lat/lng` manual tidak terpengaruh. | `2` |
| `SCRAPE_KEYWORDS` | Varian keyword yang dijalankan **per sel** (pisah koma). Hasil antar keyword di-dedup per `place_id`. Semakin banyak keyword semakin luas cakupan, semakin besar pemakaian API. | `kos,kost,kosan,indekos,rumah kos` |
| `SCRAPE_MAX_PAGES` | Maks halaman pagination per query (20 hasil/halaman, maks `5`) | `3` |
| `SCRAPE_CONCURRENCY` | Jumlah request paralel saat scrape (jangan terlalu tinggi vs quota Google) | `6` |

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
5. Klik kartu untuk melihat **detail lengkap** — hubungi via **WhatsApp**, buka **petunjuk arah**, atau **salin tautan**
6. Gunakan **filter** untuk mencari, filter rating, filter kecamatan, sorting, dan filter **favorit**
7. Simpan kos favorit dengan ikon ❤️ (tersimpan di browser) — pencarian terakhir muncul sebagai chip riwayat
8. Klik **Ekspor CSV** untuk mengunduh hasil (termasuk daftar favorit) dalam format siap Excel
9. Tekan **/** kapan saja untuk langsung fokus ke kotak pencarian

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
  "total_scraped": 25,
  "areas": [
    { "district": "Kec. Cibeunying Kidul", "count": 16 },
    { "district": "Kec. Panyileukan", "count": 7 }
  ]
}
```

> 💡 `total_scraped` = jumlah baris **baru** yang diinsert. Data yang sudah ada (match `place_id`) otomatis di-**refresh** field-nya, tidak dihitung sebagai baris baru.
>
> 🗺️ **Grid area × multi-keyword**: saat scrape tanpa `lat/lng`, bounding box kota dipecah jadi N×N sel (`SCRAPE_GRID_SIZE`, default 2×2 = 4 sel). Tiap sel dicari dengan **semua varian keyword** (`SCRAPE_KEYWORDS`, default 5) secara paralel, sehingga area pinggiran dan variasi istilah ("kos", "kost", "kosan"…) ikut terjangkau — hasil antar sel/keyword di-deduplikasi (`place_id`). Filter radius 12 km tidak berlaku di mode ini. `areas` = top 12 kecamatan berdasarkan jumlah hasil unik.

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

### Statistik Landing Page

```
GET /api/stats
```

Menampilkan agregasi seluruh data kos di database — dipakai landing page untuk statistik nyata (bukan placeholder):

**Response:**
```json
{
  "total": 1248,
  "city_count": 32,
  "cities": ["Kota Bandung", "Kabupaten Bogor", "Kota Jakarta Selatan"],
  "avg_rating": 4.6,
  "rated_count": 1012,
  "price_distribution": {
    "Murah": 310, "Sedang": 590, "Mahal": 348, "Sangat Mahal": 0
  },
  "source_counts": { "gmaps": 1180, "osm": 68 }
}
```

> 💡 `cities` diurutkan berdasarkan frekuensi (paling banyak dulu, max 30). Distribusi harga memakai kategori baku `Murah / Sedang / Mahal / Sangat Mahal`.

---

## 🧪 Testing

Project memiliki **3 lapis pengujian** yang berjalan di GitHub Actions (`.github/workflows/ci.yml`) — backend unit test, frontend unit test, dan frontend e2e.

```
┌─────────────────────────┬────────────────────────────┬──────────────────────────┐
│ Backend (pytest)        │ Frontend unit (Vitest)     │ Frontend e2e (Playwright)│
│ backend/tests/          │ frontend/tests/unit/       │ frontend/tests/e2e/      │
│ tanpa DB/network (mock) │ tanpa browser (jsdom)      │ browser asli + API stub  │
└─────────────────────────┴────────────────────────────┴──────────────────────────┘
```

Semua file test berada di folder khusus — **tidak ada** file `*.test.js`/`*.spec.js` di dalam `src/` (kode aplikasi) maupun `app/`. Berikutnya, setiap lapisan punya folder sendiri:

### 1. Backend — Unit Test (pytest)

Fungsi murni scraper & Google Places client diuji tanpa database maupun network (HTTP di-mock via `httpx.MockTransport`):

```bash
cd backend
.\venv\Scripts\python -m pip install -r requirements-dev.txt
.\venv\Scripts\python -m pytest          # 33 test
```

Yang diuji: jarak `haversine`, bounding box & pecahan grid area, ekspansi daftar keyword, ekstraksi kota/kecamatan dari alamat (anti-pencemaran token jalan), normalisasi place → `KosCreate`, rantai fallback geocode (Google → Nominatim → tabel kota umum), TTL cache 24 jam, batas halaman pagination, toleransi error (404 foto, tempat tak dikenal), escape wildcard filter, pemetaan error scrape (403/billing, key kosong), dan agregasi `build_stats` (total, kota terurut frekuensi, rata-rata rating, distribusi harga, sumber data).

### 2. Frontend — Unit Test (Vitest)

Komponen & service diuji dalam DOM tiruan (jsdom), tanpa browser dan tanpa backend. Test berada di `frontend/tests/unit/`:

```bash
cd frontend
npm run test:unit      # 79 test (Vitest)
npm run test:unit:watch
```

Yang diuji: logika tema (preferensi sistem, persist `localStorage`, reaksi perubahan OS), client API (payload, timeout scrape, `isHttpUrl`, agregasi `fetchStats`), rendering `AppIcon` (markup SVG, ikon `filled`, ikon tak dikenal), `KosCard` (badge rating, chip, fallback foto, event keyboard, favorit), `FilterBar` (emits + debounce pencarian + chip riwayat), store favorit (dedup `id`/`place_id`, batas 200, persist), store riwayat (batas 5), helper kontak (`phoneToWa`, `directionsUrl`), aksi detail `InfoSection` (WhatsApp, petunjuk arah, salin tautan, toggle favorit), dan builder CSV (escaping koma/kutip/newline, header, download via Blob).

> 🔍 **Nilai nyata unit test**: dua bug produksi pernah tertangkap di sini — konstanta `filled` di `AppIcon.vue` membayangi prop `filled` sehingga semua ikon dirender solid (bukan outline), dan `fetchStats` di `api.js` salah destructure `.data` sehingga statistik dashboard selalu `TypeError`.

### 3. Frontend — End-to-End (Playwright)

Menjalankan aplikasi nyata di browser Chromium (dev server vite otomatis dinyalakan oleh `webServer` di `playwright.config.js`). **Semua API di-stub** (`page.route`) — Google Maps di-abort, `GET/POST /api/*` di-fake — sehingga e2e berjalan **tanpa backend, PostgreSQL, maupun API key**:

```bash
cd frontend
npm run test:e2e               # 10 test
npx playwright test --headed  # lihat browser berjalan
npx playwright test -g "dark" # jalankan subset tertentu
```

File test di `frontend/tests/e2e/`:

| File | Cakupan |
|------|---------|
| `dashboard.spec.js` | Render kartu kos desktop (1280px) & mobile (390px), skeleton → kartu, alur scrape (sukses/gagal/tanpa areas), regression guard tinggi kartu |
| `theme.spec.js` | Toggle dark mode, persist `localStorage`, bertahan setelah reload, ikon header berubah |
| `icons.spec.js` | Semua ikon SVG benar-benar ter-render (bukan elemen kosong) & select tidak melebar — di light & dark, di landing/dashboard/detail |
| `chevron.spec.js` | Chevron `<select>` mengikuti tema (data-URI berbeda di light/dark) |

> 🛡️ **Guard regresi kartu menyusut** (`dashboard.spec.js`): daftar hasil memakai CSS Grid 1 kolom (bukan flexbox) dengan `max-height: 76vh` + scroll — grid row bersifat *auto-sized* sehingga kartu tidak bisa di-squeeze seperti bug lama flexbox. E2e memverifikasi tinggi kartu tidak pernah menyusut di semua breakpoint.

Hasil gagal: trace & screenshot otomatis disimpan di `frontend/test-results/` (di-upload sebagai artifact `playwright-report` oleh CI).

### GitHub Actions (CI)

`.github/workflows/ci.yml` — 3 job paralel di setiap push/PR ke `main`:

| Job | Perintah | Artifact on failure |
|-----|----------|---------------------|
| `backend` | `python -m pytest backend/tests` (Python 3.11, pip cache) | — |
| `frontend-unit` | `npm run test:unit` + `npm run build` (Node 20, npm cache) | — |
| `frontend-e2e` | `npx playwright install --with-deps chromium` + `npm run test:e2e` | `frontend/test-results` |

Karena e2e memakai stub API, workflow **tidak memerlukan** `GOOGLE_MAPS_API_KEY` maupun PostgreSQL.

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
- [x] Scrape grid area (N×N sel, default 2×2) + breakdown kecamatan di response & UI
- [x] Multi-keyword scrape paralel (varian kos/kost/kosan/indekos/rumah kos per sel) — cakupan hasil jauh lebih luas
- [x] Hardening API: escape wildcard filter, CORS via env, pesan error 403/billing yang jelas
- [x] Footer global dengan atribusi Google Maps/OSM (ToS) + tautan legal
- [x] Ekstraksi kota/kecamatan dari alamat (anti-pencemaran oleh token jalan)
- [x] Geocode fallback Nominatim + tabel kota umum saat billing Google nonaktif
- [x] Unit test backend (pytest) & frontend (Vitest) + test e2e (Playwright, folder `e2e/`)
- [x] CI/CD pipeline — GitHub Actions: pytest, vitest, build, Playwright e2e
- [x] Favorit / bookmark kos (localStorage, filter favorit, tanpa login)
- [x] Riwayat pencarian (chip cepat re-run) + shortcut global `/` untuk fokus pencarian
- [x] Aksi cepat di detail: WhatsApp (wa.me), Petunjuk arah, & salin tautan
- [x] Ekspor hasil pencarian ke CSV (UTF-8 BOM) & tombol kembali ke atas
- [x] Statistik nyata di landing page (`GET /api/stats` — total, kota, rata-rata rating)
- [x] Design refresh: font Geist, scroll-reveal, spotlight hover, stats band layered
- [x] Konsistensi mobile: input 16px (anti zoom iOS), peta/stats di layar sempit

### 🔜 Berikutnya

- [ ] Aktifkan billing untuk Place Photos (foto saat ini kosong saat billing nonaktif)
- [ ] Pagination / multi-halaman Google Places (saat ini `SCRAPE_MAX_PAGES` membatasi 3 halaman per query)
- [ ] Fitur promosi kos berbayar (featured) + form klaim owner + verifikasi admin
- [ ] Harga kos-kosan spesifik (per bulan)
- [ ] Autentikasi user
- [ ] Pagination UI di frontend
- [ ] Jadwal scraping otomatis (cron)
- [ ] Deployment ke production

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
