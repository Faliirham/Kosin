<div align="center">

# 🏠 Kosin — Kos Finder

**Platform pencarian kos-kosan berbasis data Google Maps**

Sebuah full-stack web application yang men-scrape data kos-kosan dari Google Maps, menyimpannya ke PostgreSQL, dan menampilkannya dalam dashboard interaktif dengan peta.

![Stack](https://img.shields.io/badge/Frontend-Vue%203%20%2F%20Vite-42b883)
![Stack](https://img.shields.io/badge/Backend-FastAPI-009688)
![Stack](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Stack](https://img.shields.io/badge/Scraper-Google%20Maps%20Places%20API-4285F4)

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
| 🔍 **Scraping Otomatis** | Mengambil data kos-kosan dari Google Maps berdasarkan kota & keyword |
| 🗺️ **Map View** | Visualisasi lokasi kos-kosan menggunakan Leaflet & OpenStreetMap |
| 🔎 **Pencarian** | Cari kos berdasarkan nama dengan hasil real-time |
| ⭐ **Filter Rating** | Filter berdasarkan minimal rating (2+, 3+, 4+) |
| 📊 **Sorting** | Urutkan berdasarkan terbaru, rating, atau nama |
| 📄 **Halaman Detail** | Info lengkap: alamat, kontak, jam buka, website, foto, rating |
| 💾 **Penyimpanan Persisten** | Data tersimpan di PostgreSQL dengan auto-deduplication |
| 📱 **Responsive** | Tampilan adaptif untuk desktop & mobile |

---

## 🏗️ Arsitektur

```
┌──────────────────────┐         ┌─────────────────────────────┐
│   Frontend (Vue 3)   │  HTTP   │     Backend (FastAPI)       │
│                      │ ──────► │                             │
│  ┌────────────────┐  │  REST   │  ┌───────────────────────┐  │
│  │ Dashboard      │  │  API    │  │ Scraper Module        │  │
│  │  - Peta        │  │         │  │  (Google Maps API)    │  │
│  │  - Filter      │  ◄───────  │  │                       │  │
│  │  - Detail      │  │         │  └──────────┬────────────┘  │
│  └────────────────┘  │         │             │               │
│        Vite:5173     │         │  ┌──────────▼────────────┐  │
│                      │         │  │   PostgreSQL 17       │  │
│                      │         │  │   (SQLAlchemy/async)  │  │
│                      │         │  └───────────────────────┘  │
└──────────────────────┘         └─────────────────────────────┘
        (Proxy /api → :8000)                FastAPI:8000
```

### Alur Kerja

1. User membuka dashboard dan memilih **kota** + **keyword** (contoh: "kos kosan")
2. Frontend mengirim request `POST /api/scrape` ke backend
3. Backend memanggil **Google Places API** untuk mencari & mengambil detail kos-kosan
4. Data dinormalisasi, di-deduplicate, lalu disimpan ke **PostgreSQL**
5. Frontend menampilkan hasil sebagai **kartu** dan **marker di peta**
6. User dapat klik kartu untuk melihat **detail lengkap** kos-kosan

---

## 📁 Struktur Project

```
kosin/
├── backend/                         # Python FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI entry point, CORS, router registration
│   │   ├── database.py              # Koneksi PostgreSQL async (SQLAlchemy)
│   │   ├── models.py                # ORM model tabel `kos`
│   │   ├── schemas.py               # Pydantic schemas (request/response)
│   │   ├── scraper.py               # Google Maps scraper engine (+ mock mode)
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
│       │   └── MapView.vue          # Peta Leaflet dengan markers
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
| [googlemaps](https://github.com/googlemaps/google-maps-services-python) | 4.10 | Client Google Maps API |
| [Pydantic](https://docs.pydantic.dev/) | 2.10 | Validasi & serialisasi data |
| [uvicorn](https://www.uvicorn.org/) | 0.34 | ASGI server |

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| [Vue 3](https://vuejs.org/) | 3.5 | JavaScript framework |
| [Vite](https://vite.dev/) | 6.0 | Build tool & dev server |
| [Axios](https://axios-http.com/) | 1.7 | HTTP client |
| [Leaflet](https://leafletjs.com/) | 1.9 | Map library (OpenStreetMap) |

### Database
| Teknologi | Versi |
|-----------|-------|
| [PostgreSQL](https://www.postgresql.org/) | 14+ (tested on 17) |

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
| `GOOGLE_MAPS_API_KEY` | API key Google Maps | `AIzaSy...` |

### Mendapatkan Google Maps API Key

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru (atau pilih existing)
3. Aktifkan **Places API**
4. Buat API key di **Credentials → Create Credentials → API Key**
5. Tempel key tersebut ke `GOOGLE_MAPS_API_KEY` di `.env`

> ⚠️ **Tanpa API key**, scraper berjalan dalam **mock mode** dan mengembalikan data contoh (3 kos dummy) agar pengembangan tetap berjalan.

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
2. Masukkan **kota** (contoh: Bandung, Jakarta, Surabaya)
3. Klik tombol **Scrape**
4. Hasil kos-kosan muncul sebagai kartu + marker di peta
5. Klik kartu untuk melihat **detail lengkap**
6. Gunakan **filter** untuk mencari, filter rating, dan sorting

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
| `keyword` | string | Keyword pencarian (default: `"kos kosan"`) | ❌ |

**Contoh:**
```json
{
  "city": "Bandung",
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

---

### List Kos-Kosan

```
GET /api/kos
```

**Query Parameters:**

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `city` | string | Filter berdasarkan kota (partial match) |
| `search` | string | Cari berdasarkan nama (partial match) |
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
      "address": "Jl. Sudirman No. 5, Bandung",
      "city": "Bandung",
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

## 🗃️ Data Model

### Tabel `kos`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | `UUID` | Primary key (auto-generated) |
| `name` | `VARCHAR(255)` | Nama kos-kosan |
| `address` | `TEXT` | Alamat lengkap |
| `city` | `VARCHAR(100)` | Kota lokasi |
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

- [x] Scraping data kos-kosan dari Google Maps
- [x] Dashboard dengan map view (Leaflet)
- [x] Filter & sorting data
- [x] Halaman detail kos-kosan
- [ ] Harga kos-kosan spesifik (per bulan)
- [ ] Autentikasi user
- [ ] Favorit / bookmark kos
- [ ] Jadwal scraping otomatis (cron)
- [ ] Deployment ke production
- [ ] Unit & integration testing
- [ ] CI/CD pipeline

---

## 📝 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan pengembangan.

---

<div align="center">

Dibuat dengan ❤️ menggunakan **FastAPI** & **Vue 3**

</div>
