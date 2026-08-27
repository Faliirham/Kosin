# Rencana Produksi — Kos Finder (Kosin)

> **Dokumen perencanaan produksi** — strategi bisnis, kepatuhan legal, arsitektur target, biaya operasional, dan roadmap implementasi.
>
> **Versi:** 1.0 · **Tanggal:** Agustus 2026 · **Status:** Draft untuk persetujuan

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Audit Kondisi Saat Ini](#2-audit-kondisi-saat-ini)
3. [Legalitas & Sumber Data](#3-legalitas--sumber-data)
4. [Model Bisnis & Arsitektur Target](#4-model-bisnis--arsitektur-target)
5. [Opsi Monetisasi](#5-opsi-monetisasi)
6. [Rincian Biaya Bulanan](#6-rincian-biaya-bulanan)
7. [Infrastruktur & Deployment](#7-infrastruktur--deployment)
8. [Roadmap Bertahap](#8-roadmap-bertahap)
9. [Risiko & Mitigasi](#9-risiko--mitigasi)
10. [Checklist Perubahan Kode](#10-checklist-perubahan-kode)

---

## Status Implementasi (per Agustus 2026)

> **Keputusan operasional:** Arsitektur saat ini **dipertahankan** (data Google tetap
> disimpan permanen seperti ada). Refactor legal Fase 1 dan deploy Fase 3 **diluar scope**
> untuk saat ini — fokus ke penguatan (hardening), seed OSM, dan polish UI/UX agar nyaman
> dipakai di lokal. Peluncuran publik tetap menanggung risiko ToS Google (catatan di §2.4).

### Yang sudah dikerjakan

- **Batch 1 — Restore `/api` prefix & port DB**; commit `c092077`.
- **Batch 2 — Hardening scraper** (merangkum `§7.3` #1, #2, #3, #6):
  - Lock per-kota (`dict` `asyncio.Lock`) — kota berbeda scrape paralel, kota sama di-dedup.
  - Rate-limit 3 scrape/jam/IP (429 bila melampaui).
  - `POST /api/scrape` menjalankan background task + 202 langsung; frontend poll `GET /api/kos`.
  - `run_migrations` menambah ekstensi `pg_trgm` + index GIN trigram (city/district/kelurahan).
  - commit `0947299`.
- **Batch 3 — Seed OSM/Overpass** (`§Fase 1`): `backend/app/overpass.py` mengambil kos dari
  Overpass saat Google kosong; commit `ffaf484`.
- **Batch 5 — UI/UX Full**:
  - Ganti picsum dengan ilustrasi SVG branded (`utils/illustrations.js`, `public/og-image.svg`); `aef8702`.
  - Sync list↔peta (hover/click menyorot marker & card); `3050777`.
  - Staggered entrance `KosCard` + marker clustering di peta; `bad8bcc`.
  - Rail "Kos lain di {city}" di detail + filter harga + lightbox galeri; `505073a`.

### Belum dikerjakan (luar scope saat ini)

- Fase 1 — refactor legal (hanya `place_id` yang disimpan) — **ditunda**.
- Fase 2 — fitur klaim & monetisasi — belum.
- Fase 3 — Docker/deploy — **ditunda** (tidak ada deploy).
- Fase 4 — skala & maturasi — belum.

---

## 1. Ringkasan Eksekutif

**Kosin** adalah platform pencarian kos-kosan (boarding house) yang menghubungkan **pencari kos** dengan **pemilik kos** secara langsung — tanpa perantara pihak ketiga. Saat ini berjalan sebagai aplikasi full-stack (FastAPI + Vue 3 + PostgreSQL) dengan data dari Google Places API dan geocode fallback OpenStreetMap.

### Visi Produk

- Pencari kos mudah menemukan kos dengan data yang lengkap dan terpercaya.
- Pemilik kos mudah **ditemukan** dan **mempublikasikan** kosnya tanpa melalui perantara.
- Platform menjadi **katalog permanen milik sendiri**, bukan sekadar penyalur data pihak lain.

### Keputusan Kunci (Hasil Diskusi)

| # | Keputusan | Alasan |
|---|---|---|
| 1 | **Tidak menyimpan data Google permanen** | Melanggar Google ToS (hanya `place_id` yang boleh disimpan selamanya) |
| 2 | **Sumber data permanen = UGC pemilik + OSM** | Legal (ODbL/milik sendiri), gratis, dan justru lebih kaya dari Google |
| 3 | **Google hanya sebagai layer penemuan/enrichment** | Cache maksimal 24–30 hari, biaya terkendali |
| 4 | **Monetisasi B2B (pemilik bayar), pencari gratis** | Sumber pendapatan utama: promosi/highlight, bukan paywall pencari |
| 5 | **Target skala awal: 1.000 DAU** | VPS kecil (2 vCPU/4GB) + Docker Compose sudah lebih dari cukup |
| 6 | **Biaya operasional target: ±$15–50/bulan** | Aman, tidak bergantung pada kuota gratis Google |

### Target Skala

| Metrik | Target |
|---|---|
| Daily Active Users (DAU) | 1.000 |
| Monthly Active Users (MAU) | ±3.000–5.000 |
| Kota terlayani saat launch | 5–10 (dapat diperluas) |
| Biaya infra (VPS) | ±$5/bulan |
| Biaya Google API | ±$10–40/bulan (dalam batas kuota gratis sebagian besar) |
| **Total operasional** | **±$15–45/bulan** |

---

## 2. Audit Kondisi Saat Ini

### 2.1 Arsitektur yang Ada

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

### 2.2 Kekuatan yang Sudah Dimiliki

- ✅ **3 lapis pengujian**: backend pytest (33 test), frontend Vitest (79 test), Playwright e2e (10 test) — berjalan di CI GitHub Actions.
- ✅ **Fitur lengkap**: grid area scraping, multi-keyword, filter/sort, peta Google Maps, detail live-fetch, favorit, riwayat, CSV export, dark mode, responsif.
- ✅ **Hardening dasar**: escape wildcard ILIKE, CORS via env, error mapping 403/billing, dedup `place_id`, savepoint per baris.
- ✅ **Secrets aman**: `.env` di-gitignore; hanya `.env.example` yang ter-commit.
- ✅ **Kode rapi & terstruktur**: pemisahan service, routers, tests terpisah dari kode aplikasi.

### 2.3 Celah Menuju Produksi

| Kategori | Celah | Severity |
|---|---|---|
| **Legal** | Menyimpan data Google (nama, alamat, rating, foto) permanen di PostgreSQL → melanggar ToS | 🔴 Kritis |
| **Legal** | Scrape endpoint publik tanpa proteksi → siapa pun bisa membakar kuota | 🔴 Kritis |
| **Infra** | Belum ada Dockerfile / docker-compose / reverse proxy (nginx) | 🟠 Tinggi |
| **Infra** | CI hanya testing, belum ada workflow deploy | 🟠 Tinggi |
| **Skala** | Cache in-memory per-proses → duplikasi panggilan Google saat multi-worker | 🟠 Tinggi |
| **Skala** | `asyncio.Lock` global serialisasi semua scrape; scrape sinkron (user menunggu menit) | 🟡 Sedang |
| **DB** | Filter `city` pakai `ILIKE '%x%'` tanpa index → full-scan saat data besar | 🟡 Sedang |
| **Ops** | Tidak ada monitoring biaya Google, alert budget, backup | 🟡 Sedang |

### 2.4 ⚠️ Temuan Legal (Paling Kritis)

Kode saat ini melanggar **Google Maps Platform Terms of Service**:

- `scraper.py` → `routers/scraper.py` menyimpan **nama, alamat, kota, kecamatan, rating, harga, foto** dari Google secara permanen di tabel `kos` (`backend/app/models.py`).
- Google hanya mengizinkan: menyimpan **`place_id` selamanya**; konten lain **maksimal 30 hari**; dan **dilarang membangun database independen berisi listing tempat** dari data Google.
- Risiko: **pencabutan akses API** oleh Google dan proyek berhenti berfungsi.

**Konsekuensi:** arsitektur produksi harus diubah sebelum diluncurkan (lihat Bagian 3–4).

---

## 3. Legalitas & Sumber Data

### 3.1 Aturan Google yang Berlaku (2026)

**Sumber:** [Places API Policies](https://developers.google.com/maps/documentation/places/web-service/policies), [Maps Platform ToS](https://cloud.google.com/maps-platform/terms), [Service Specific Terms](https://cloud.google.com/archive/maps-platform/terms/maps-service-terms-20250630)

| Data | Boleh disimpan? | Ketentuan |
|---|---|---|
| `place_id` | ✅ **Selamanya** | Satu-satunya field yang di-exempt dari aturan cache |
| Nama, alamat, rating, ulasan, telepon, website, foto, koordinat | ❌ **Maksimal 30 hari** | Wajib dihapus setelahnya, atau diganti data user |
| Database listing permanen dari Google | ❌ **Dilarang total** | "No Scraping, No Caching, No Creating a Database" (ToS §3.2.4) |
| Menjual/memungut biaya akses ke Google Content | ❌ **Dilarang** | Klausul "No Reselling" |

### 3.2 Perubahan Harga Google (Maret 2025)

Kredit flat **$200/bulan dihapus**, diganti **kuota gratis per-SKU** (reset tiap bulan):

| SKU | Gratis/bulan | Tarif setelah kuota |
|---|---|---|
| Place Details Essentials | 10.000 | $5 / 1.000 |
| Place Details Pro | 5.000 | $17 / 1.000 |
| Place Details Enterprise (field rating/contact) | 1.000 | $20 / 1.000 |
| Text Search Pro | 5.000 | $32 / 1.000 |
| Text Search Enterprise (field rating) | 1.000 | $35 / 1.000 |
| Place Photos | 1.000 | $7 / 1.000 |
| Geocoding | 10.000 | $5 / 1.000 |
| Maps JavaScript (map load) | 10.000 | $7 / 1.000 |
| Text Search / Details **IDs Only** | **Tak terbatas** | — |

> ⚠️ **Penting:** meminta field `rating`, `userRatingCount`, `priceLevel`, `phone`, `website` menaikkan panggilan ke **tier Enterprise** (kuota gratis hanya 1.000/bln). Field mask yang hemat adalah pengungkit biaya terbesar.

### 3.3 Tiga Sumber Data & Perannya

| Sumber | Lisensi | Disimpan permanen? | Peran |
|---|---|---|---|
| **UGC pemilik** (klaim kos) | Milik pengguna → milik platform | ✅ Ya | **Sumber utama** — data paling lengkap & legal dijual/monetisasi |
| **OpenStreetMap** (Overpass) | ODbL | ✅ Ya | **Seed katalog gratis** — kos yang belum diklaim |
| **Google Places** | ToS Google | ❌ Hanya `place_id` | **Layer penemuan + enrichment** — cache ≤24–30 jam |

### 3.4 Matriks Legalitas Model Bisnis

| Model | Legal? | Biaya/bln | Keterangan |
|---|---|---|---|
| Simpan semua data Google permanen (kondisi saat ini) | ❌ | — | Risiko pencabutan akses |
| Full-fetch Google (katalog kecil) | ✅ | ±$300–400 | Mahal, katalog terbatas |
| Full-fetch Google (katalog nasional) | ✅ | ±$2.500+ | Tidak layak |
| OSM basis + Google enrichment | ✅ | ±$15–40 | Data polos (tanpa rating/foto) |
| **Hibrida: UGC + OSM + Google enrichment** | ✅ | **±$15–50** | **TERPILIH** — data kaya + murah + legal |

---

## 4. Model Bisnis & Arsitektur Target

### 4.1 Konsep: "Penemuan Google → Klaim → Katalog Permanen"

Pemilik kos **tidak perlu mendaftar atau mengisi katalog** — cukup memiliki kos di Google Maps (kebiasaan yang sudah ada). Platform otomatis menemukannya. Data menjadi permanen & bernilai hanya jika pemilik **mengklaim** kosnya.

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Pemilik menambahkan kos di Google Maps (seperti biasa)           │
│ 2. Scraper menemukan kos saat pencarian kota (Google, cache 24 jam) │
│ 3. Kos muncul di katalog — GRATIS, sebagai layer penemuan           │
│ 4. Pemilik "Klaim" kos (verifikasi WhatsApp OTP, ±30 detik)         │
│ 5. Data beralih menjadi milik platform (UGC) → disimpan permanen ✅ │
│ 6. Pemilik membeli promosi → kos muncul terhighlight                │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Arsitektur Target

```
                  ┌──────────────────────────────────────────┐
                  │          DATABASE ANDA (permanen)        │
                  │  • Data pemilik (klaim) — RICH + RATED   │ ← sumber utama
                  │  • Data OSM (Overpass) — seed gratis     │ ← ODbL
                  │  • place_id saja (untuk enrichment)      │
                  │  • status promosi & paket                │
                  └──────────────────────────────────────────┘
                                  │
        user cari kota → cek DB dulu → tampil dari DB (GRATIS)
                                  │
              ┌───────────────────┴────────────────────┐
              │ Google live-fetch (cache ≤24 jam)      │
              │ Hanya untuk kos yang BELUM diklaim     │
              │ (rating, foto, telepon)                │
              └────────────────────────────────────────┘
                                  │
        pemilik klaim kos → verifikasi → data permanen + bisa promosi
```

### 4.3 Alur "Cari Kota" (Backend)

```
POST /api/scrape {city}
        │
        ▼
┌─ Apakah kota sudah ada di DB (OSM/UGC)? ──────┐
│  YA  → sajikan dari DB (gratis, tanpa Google) │
│  TIDAK → scrape Overpass (gratis) + simpan    │
│         → Google Text Search (cache 24 jam)   │
│           hanya untuk melengkapi yang kurang   │
└───────────────────────────────────────────────┘
        │
        ▼
User membuka detail kos
        │
        ├─ Sudah diklaim pemilik? → data DB (gratis)
        └─ Belum diklaim? → Google Details + Photos (cache 24 jam)
```

### 4.4 Prinsip Kunci

1. **Data Google tidak pernah menetap >24 jam** — hanya `place_id` yang masuk database.
2. **List & peta selalu dari DB** — tidak pernah menyentuh Google → biaya $0 untuk browsing.
3. **Google hanya dipanggil** saat: (a) kota baru di-scrape, (b) detail kos yang belum diklaim.
4. **Kunci biaya = cache 24 jam yang ketat** (Redis, shared antar-worker) + field mask hemat (rating di-fetch hanya di detail, bukan di Text Search).

---

## 5. Opsi Monetisasi

### 5.1 Ringkasan Tiga Opsi

| Opsi | Target | Legal | Revenue @1.000 DAU | Kompleksitas |
|---|---|---|---|---|
| **A. Promosi/Highlight pemilik** | Pemilik kos | ✅ Ya (jual posisi di platform sendiri) | Potensial besar (B2B) | 🟢 Rendah |
| **B. Paywall detail/telepon premium** | Pencari kos | ⚠️ Hanya untuk data UGC (bukan Google) | Kecil | 🟠 Sedang |
| **C. Iklan banner (AdSense/afiliasi)** | Pengiklan | ✅ Ya | ±$3–15/bln (kecil) | 🟢 Rendah |

### 5.2 Analisis Detail

#### Opsi A — Promosi/Highlight Pemilik (REKOMENDASI Rilis Pertama)

- Pemilik membayar paket (mingguan/bulanan) agar kos muncul **di atas hasil pencarian** dengan badge/penanda khusus.
- Cocok dengan karakter bisnis "tanpa pihak ketiga": pemilik membayar platform Anda, bukan Google.
- **Implementasi termurah**: kolom `is_promoted` + `promotion_expires_at` + prioritas sorting di `list_kos`. Tidak butuh payment gateway kompleks di tahap awal (manual/admin atau transfer).

#### Opsi B — Paywall Detail/Telepon Premium

- **Legal hanya untuk kos yang sudah diklaim** (data milik pemilik). Nomor telepon dari Google **tidak boleh dijual aksesnya** (No Reselling).
- Alternatif yang lebih aman & ramah pencari: pencari **mengisi form kontak** → lead diteruskan ke pemilik (gratis untuk pencari); pemilik membayar untuk melihat kontak pencari / menerima lead lebih banyak.
- Butuh sistem pembayaran, kebijakan privasi, dan penanganan data pribadi — **tunda ke fase lanjutan**.

#### Opsi C — Iklan Banner

- Paling cepat dipasang, tapi revenue sangat kecil di skala 1.000 DAU (±$3–15/bln).
- Cocok sebagai pelengkap, bukan tulang punggung pendapatan.

### 5.3 Rekomendasi

```
Fase 1 (rilis):   Opsi A — Promosi/Highlight pemilik (bayar tampil di atas)
Fase 2 (tumbuh):  Opsi C — Banner iklan lokal (pelengkap)
Fase 3 (skala):   Opsi B — Lead premium (form kontak berbayar untuk pemilik)
```

**Prinsip: pencari selalu gratis; pemilik yang membayar.** Ini menjaga traffic (sisi permintaan) tetap besar, menarik lebih banyak pemilik untuk ikut.

---

## 6. Rincian Biaya Bulanan

### 6.1 Asumsi (1.000 DAU)

| Parameter | Nilai |
|---|---|
| Kunjungan/bulan | ±30.000 (tiap user ±1×/hari) |
| Detail dibuka | ±7.500/bln (25% kunjungan) |
| Tempat unik disajikan/hari | ±1.500 (katalog 5–10 kota) |
| Kota baru di-scrape | ±30/bln |

### 6.2 Perbandingan Tiga Skenario

| Komponen | A. Full-fetch (katalog kecil) | B. OSM basis + enrichment | C. Hibrida UGC+OSM+Google (TERPILIH) |
|---|---|---|---|
| Text Search (discovery) | $0 (dalam kuota) | $0 | $0 |
| Place Details (isi list + detail) | ±$145 | $0 (list dari DB) | ±$10–25 (hanya detail unclaimed) |
| Place Photos | ±$46 | ±$10 | ±$10 |
| Maps JS | ±$98 | ±$98 | ±$98* |
| Geocoding | $0 | $0 | $0 |
| **Total Google** | **±$290–400** | **±$108** | **±$20–45** |
| VPS (Hetzner CX22) | ±$5 | ±$5 | ±$5 |
| **GRAND TOTAL** | **±$295–405** | **±$113** | **±$25–50** |

> \* Maps JS memakai kuota gratis 10.000 load/bln; ±30.000 kunjungan → sebagian melewati kuota. **Mitigasi:** 1 map load per sesi (cukup sekali saat dashboard dibuka) atau batasi peta di halaman list (opsional di mobile). Dengan 24.000 load: 14.000 × $7/1k = **±$98**.

### 6.3 Sensitivitas (Model C)

| Faktor berubah | Dampak biaya |
|---|---|
| Detail-click naik 50% | +$10–15 |
| Kota baru scraped 3× lebih banyak | +$5–10 |
| Traffic naik 10× (10.000 DAU) | **Hampir tidak berubah** (browsing dari DB, cache 24 jam) |
| Foto ditarik hanya 1 per detail | −$5–8 |

> **Model C tahan ledakan biaya** — inilah alasan utama pemilihannya. Biaya Google hampir tidak sensitif terhadap traffic, hanya terhadap jumlah tempat unik & klik detail.

### 6.4 Estimasi Biaya Bulanan (Ringkas)

| Item | Biaya |
|---|---|
| VPS 2 vCPU/4GB (Hetzner) | ±€4,50 (~$5) |
| PostgreSQL + Redis | $0 (container di VPS) |
| Google API (enrichment) | ±$10–40 |
| Domain (opsional) | ±$1 |
| **Total** | **±$15–45/bulan** |

---

## 7. Infrastruktur & Deployment

### 7.1 Topologi Target

```
                        ┌──────────────────────────────┐
                        │          VPS 2 vCPU/4GB      │
   User ──HTTPS──►      │  ┌────────────────────────┐  │
                        │  │ nginx (reverse proxy)  │  │
                        │  │  • serve frontend dist │  │
                        │  │  • /api → backend:8000 │  │
                        │  └───────────┬────────────┘  │
                        │              │               │
                        │  ┌───────────▼────────────┐  │
                        │  │ backend (FastAPI)      │  │
                        │  │ uvicorn --workers 2-4  │  │
                        │  └───┬──────────┬─────────┘  │
                        │      │          │            │
                        │  ┌───▼───┐  ┌───▼───┐        │
                        │  │Redis  │  │Postgres        │
                        │  │(cache │  │ (volume)       │
                        │  │ 24 jam)│  │                │
                        │  └───────┘  └────────┘        │
                        └──────────────────────────────┘
```

### 7.2 Komponen yang Harus Dibuat

| Komponen | Isi |
|---|---|
| `backend/Dockerfile` | python:3.11-slim, `requirements.txt`, `uvicorn app.main:app --workers 2` |
| `frontend/Dockerfile` | Multi-stage: node:20 build → nginx:alpine serve `dist/` |
| `frontend/nginx.conf` | Static cache headers, gzip, proxy `/api` → `backend:8000` |
| `docker-compose.yml` | `postgres:17` (volume + healthcheck) → `backend` → `frontend` |
| `docker-compose.prod.yml` | Varian produksi (env, restart policy, logging) |
| `.github/workflows/deploy.yml` | Build image → SSH ke VPS → `docker compose up -d` |

### 7.3 Hardening yang Diperlukan

1. **Rate-limit** `POST /api/scrape` (per-IP, mis. 3/jam) — jaring pengaman kuota Google.
2. **Lock per-kota** (ganti `_scrape_lock` global) — kota berbeda bisa scrape paralel; kota sama di-dedup.
3. **Background task** untuk scrape — user tidak menunggu berapa menit; UI tampilkan data lama dulu.
4. **Redis cache** untuk `places.TTLCache` — shared antar-worker, hemat panggilan Google.
5. **Field mask hemat** — jangan minta `rating`/`priceLevel` di Text Search (turun ke tier Pro = 5.000 gratis/bln); rating di-fetch hanya di detail.
6. **Index DB**: `ix_kos_city`, pg_trgm GIN index untuk ILIKE `%city%` / `%district%`.
7. **Uvicorn multi-worker** (2–4) + `--limit-max-requests` untuk siklus memori.
8. **Env produksi**: `CORS_ORIGINS`, `VITE_GOOGLE_MAPS_KEY` (restrict referrer), `DATABASE_URL`, `REDIS_URL`.

### 7.4 Monitoring

- **Google Cloud Console**: cek pemakaian per-SKU harian; pasang **budget alert** (mis. $30/bln) → notifikasi email.
- **Backend**: log structured + endpoint `/api/health` untuk uptime check.
- **DB**: backup harian otomatis (pg_dump cron) + restore drill.

---

## 8. Roadmap Bertahap

### Fase 1 — Refactor Legal & Fondasi (sebelum launch)

- [ ] Migration DB: kolom permanen dibatasi ke `place_id` + `source` + `city/district` + metadata milik sendiri; data Google lama di-cleanup (≤30 hari).
- [ ] Tambah scraper **Overpass (OSM)** sebagai seed gratis.
- [ ] `places.py`: cache pindah ke Redis (TTL 24 jam).
- [ ] Proteksi: rate-limit scrape, lock per-kota, background task.
- [ ] Index DB + pg_trgm.
- [ ] Field mask hemat (rating hanya di detail).

### Fase 2 — Fitur Klaim & Monetisasi MVP

- [ ] Kolom `owner_claimed`, `owner_phone`, `price_monthly`, `facilities` + tabel `promotions`.
- [ ] `POST /api/kos/{id}/claim` → verifikasi WhatsApp OTP.
- [ ] Halaman klaim + kelola listing di frontend.
- [ ] `POST /api/promotions` → `is_promoted` + prioritas sort di `list_kos` + badge UI.

### Fase 3 — Deploy Produksi

- [ ] Dockerfile backend & frontend + nginx.conf + docker-compose.
- [ ] Workflow deploy GitHub Actions → VPS.
- [ ] Env produksi + Google budget alert.
- [ ] UAT (user acceptance test) di staging → cutover.

### Fase 4 — Skala & Maturasi

- [ ] Multi-worker, observability (metrics, tracing), structured logging.
- [ ] Autentikasi owner (login/registrasi) yang lebih kuat.
- [ ] Payment gateway untuk promosi (manual → otomatis).
- [ ] Opsi B monetisasi: lead premium (form kontak).
- [ ] Backup otomatis + failover.

---

## 9. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Pencabutan akses Google API** (akibat simpan data permanen) | Aplikasi berhenti berfungsi | Refactor ke model UGC+OSM sebelum launch; hanya `place_id` yang disimpan |
| **Biaya Google meledak** (full-fetch / scrape berlebihan) | Tagihan ratusan–ribuan dolar | Model C + rate-limit + cache 24 jam + budget alert $30/bln |
| **Data Google tidak boleh dijual** (paywall telepon) | Pelanggaran ToS | Paywall hanya untuk data UGC/klaim; pencari selalu gratis |
| **Kualitas data OSM kurang** untuk sebagian kota | Katalog terlihat kosong | Google enrichment di detail + ajak pemilik klaim (UGC mengisi celah) |
| **Scrape sinkron menggantung worker** | UX buruk saat beban tinggi | Background task + lock per-kota |
| **Single point of failure VPS** | Downtime | Backup harian, uptime check, dokumentasi restore |
| **Perubahan harga/kuota Google** (sudah terjadi Maret 2025) | Biaya berubah mendadak | Model tidak bergantung kuota gratis — tetap murah meski semua berbayar |

---

## 10. Checklist Perubahan Kode

### Backend

| File | Perubahan |
|---|---|
| `backend/app/models.py` | Hapus/mark kolom data Google non-`place_id`; tambah `owner_claimed`, `owner_phone`, `price_monthly`, `facilities`, `is_promoted`, `promotion_expires_at`; tabel `promotions` |
| `backend/app/schemas.py` | Schema klaim & promosi; sesuaikan `KosResponse` |
| `backend/app/places.py` | Cache → Redis; field mask hemat (tanpa rating di search) |
| `backend/app/scraper.py` | Tambah scraper Overpass (OSM); Google hanya discovery + return in-session; `place_id` saja yang dipersist |
| `backend/app/routers/scraper.py` | Cek-before-scrape (kota ada di DB?); lock per-kota; rate-limit; background task |
| `backend/app/routers/kos.py` | `_enrich_gmaps` tetap (cache 24 jam); prioritas `is_promoted` di `list_kos`; endpoint `claim` & `promotions` |
| `backend/app/main.py` | `run_migrations`: index baru (`city`, pg_trgm), cleanup data lama |
| `backend/app/database.py` | Konfigurasi Redis (opsional di file terpisah `cache.py`) |
| `backend/requirements.txt` | + `redis`, + `slowapi` (rate-limit) |

### Frontend

| File | Perubahan |
|---|---|
| `frontend/src/services/api.js` | Client untuk endpoint claim & promosi |
| `frontend/src/components/KosCard.vue` | Badge "Terpromosi"/highlight |
| `frontend/src/components/FilterBar.vue` | Tombol "Klaim kos ini" di detail |
| `frontend/src/views/DetailKos.vue` | Form klaim (verifikasi OTP WhatsApp), info paket promosi |
| `frontend/src/views/Dashboard.vue` | Poll background scrape; prioritas tampilan promosi |
| `frontend/src/views/` | Halaman admin sederhana: kelola promosi (opsional Fase 2) |

### Infra (baru)

| File | Isi |
|---|---|
| `backend/Dockerfile` | Image backend multi-worker |
| `frontend/Dockerfile` | Build → nginx serve static |
| `frontend/nginx.conf` | Proxy `/api`, gzip, cache header |
| `docker-compose.yml` | postgres + redis + backend + frontend |
| `.github/workflows/deploy.yml` | Deploy otomatis ke VPS |

---

## Lampiran

### A. Sumber Referensi

- Google Maps Platform ToS: <https://cloud.google.com/maps-platform/terms>
- Places API Policies (caching & storage): <https://developers.google.com/maps/documentation/places/web-service/policies>
- Service Specific Terms (30-hari caching): <https://cloud.google.com/archive/maps-platform/terms/maps-service-terms-20250630>
- Harga core services: <https://developers.google.com/maps/billing-and-pricing/pricing>
- OpenStreetMap lisensi ODbL: <https://www.openstreetmap.org/copyright>

### B. Istilah

| Istilah | Arti |
|---|---|
| UGC | User-Generated Content — data yang diisi pemilik kos (milik platform setelah klaim) |
| ODbL | Open Database License — lisensi data OpenStreetMap (bebas simpan/sajikan dengan atribusi) |
| SKU | Unit penagihan Google per API (masing-masing punya kuota gratis bulanan) |
| Enrichment | Pengayaan data (rating, foto, telepon) yang di-fetch real-time dari Google |
| DAU / MAU | Daily / Monthly Active Users |