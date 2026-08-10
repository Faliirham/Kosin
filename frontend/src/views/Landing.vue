<template>
  <div class="landing">
    <!-- ── Hero ─────────────────────── -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <img class="hero-photo" :src="heroImg" alt="" />
        <div class="hero-tint"></div>
        <div class="hero-blob blob-a"></div>
        <div class="hero-blob blob-b"></div>
      </div>

      <div class="hero-inner">
        <div class="hero-copy">
          <span class="hero-badge">
            <AppIcon name="sparkle" :size="15" />
            Data langsung dari Google Maps &amp; OpenStreetMap
          </span>

          <h1 class="hero-title">
            Temukan kos yang <em>terasa seperti rumah</em>
          </h1>

          <p class="hero-sub">
            Telusuri ribuan kos-kosan di seluruh Indonesia — lengkap dengan rating asli,
            foto, dan lokasi presisi. Tidak perlu jalan keliling lagi.
          </p>

          <form class="hero-search" @submit.prevent="submitSearch">
            <AppIcon name="search" class="search-mark" :size="20" />
            <input
              v-model="city"
              type="text"
              placeholder="Masukkan kota — Bandung, Jakarta, Yogyakarta…"
              aria-label="Nama kota"
            />
            <button type="submit">
              Cari kos
              <AppIcon name="arrow-right" :size="17" />
            </button>
          </form>

          <div class="hero-popular">
            <span class="popular-label">Populer:</span>
            <button
              v-for="c in popularCities"
              :key="c"
              class="popular-chip"
              @click="goCity(c)"
            >{{ c }}</button>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-card-main">
            <img :src="heroImg" :alt="altHero" />
            <div class="hero-card-shade"></div>
            <div class="hero-card-live">
              <span class="live-dot"></span>
              Live dari Google Maps
            </div>
          </div>

          <div class="float-card float-top">
            <span class="float-icon">
              <AppIcon name="star" filled :size="18" />
            </span>
            <div>
              <strong>4,6</strong>
              <span>rata-rata rating</span>
            </div>
          </div>

          <div class="float-card float-bottom">
            <span class="float-icon float-icon-alt">
              <AppIcon name="map-pin" :size="18" />
            </span>
            <div>
              <strong>30+ kota</strong>
              <span>tercakup di Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Stats ────────────────────── -->
    <section class="stats-band" aria-label="Statistik">
      <div class="stats-inner">
        <div class="stat-item">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">kos tercatat</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.cities }}</span>
          <span class="stat-label">kota tercakup</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.rating }}</span>
          <span class="stat-label">rata-rata rating</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">24 jam</span>
          <span class="stat-label">cache detail Google</span>
        </div>
      </div>
    </section>

    <!-- ── Features ─────────────────── -->
    <section class="section" id="fitur">
      <div class="section-head">
        <span class="eyebrow">Kenapa Kos Finder</span>
        <h2 class="section-title">Cari kos lebih pintar,<br />bukan lebih capek</h2>
        <p class="section-sub">
          Kami menggabungkan data Google Maps dengan tampilan yang jujur, supaya kamu
          bisa membandingkan kos tanpa harus keliling kota satu per satu.
        </p>
      </div>

      <div class="bento">
        <article class="bento-card bento-photo">
          <img :src="imgRoom1" :alt="altRoom1" />
          <div class="bento-shade"></div>
          <div class="bento-caption">
            <h3>Lihat kondisi kos sebelum datang</h3>
            <p>Foto di-resolve langsung dari Google saat kamu membuka detail kos.</p>
          </div>
        </article>

        <article class="bento-card bento-accent">
          <span class="bento-icon">
            <AppIcon name="star" filled :size="22" />
          </span>
          <h3>Rating asli</h3>
          <p>Penilaian dan ulasan diambil langsung dari Google Maps — bukan angka rekaan.</p>
        </article>

        <article class="bento-card">
          <span class="bento-icon">
            <AppIcon name="map-pin" :size="22" />
          </span>
          <h3>Peta presisi</h3>
          <p>Google Maps menampilkan posisi tiap kos secara akurat, dekat dengan kampus atau kantormu.</p>
        </article>

        <article class="bento-card">
          <span class="bento-icon">
            <AppIcon name="layers" :size="22" />
          </span>
          <h3>Update otomatis</h3>
          <p>Re-scrape menyegarkan data lama secara langsung, tanpa duplikat dan tanpa data basi.</p>
        </article>

        <article class="bento-card bento-photo bento-photo-tall">
          <img :src="imgRoom2" :alt="altRoom2" />
          <div class="bento-shade"></div>
          <div class="bento-caption">
            <h3>Bandingkan dalam satu tampilan</h3>
            <p>Rating, harga, dan lokasi tersaji berdampingan.</p>
          </div>
        </article>
      </div>
    </section>

    <!-- ── How it works ─────────────── -->
    <section class="section section-alt" id="cara-kerja">
      <div class="section-head">
        <span class="eyebrow">Cara kerja</span>
        <h2 class="section-title">Tiga langkah sederhana</h2>
      </div>

      <div class="steps">
        <article class="step">
          <span class="step-num">01</span>
          <div class="step-body">
            <h3>Masukkan kota</h3>
            <p>Tulis kota atau kecamatan tujuanmu. Kosongkan jika ingin melihat semua.</p>
          </div>
        </article>
        <div class="step-connector" aria-hidden="true">
          <AppIcon name="arrow-right" :size="22" />
        </div>
        <article class="step">
          <span class="step-num">02</span>
          <div class="step-body">
            <h3>Kami cari dari Google Maps</h3>
            <p>Scraper menarik data kos terdekat — nama, alamat, rating, hingga rentang harga.</p>
          </div>
        </article>
        <div class="step-connector" aria-hidden="true">
          <AppIcon name="arrow-right" :size="22" />
        </div>
        <article class="step">
          <span class="step-num">03</span>
          <div class="step-body">
            <h3>Bandingkan &amp; pilih</h3>
            <p>Filter rating, urutkan, dan buka detail kos favoritmu dalam hitungan detik.</p>
          </div>
        </article>
      </div>

      <div class="cta-row">
        <button class="btn-primary-lg" @click="goCity('')">
          Mulai cari kos
          <AppIcon name="arrow-right" :size="18" />
        </button>
      </div>
    </section>

    <!-- ── Cities ───────────────────── -->
    <section class="section" id="kota">
      <div class="section-head">
        <span class="eyebrow">Kota populer</span>
        <h2 class="section-title">Mau pindah ke mana?</h2>
        <p class="section-sub">Pilih kota favoritmu untuk langsung melihat kos-kosan di sekitarnya.</p>
      </div>

      <div class="city-grid">
        <button
          v-for="c in cityCards"
          :key="c.name"
          class="city-card"
          @click="goCity(c.name)"
        >
          <span class="city-icon">
            <AppIcon name="buildings" :size="22" />
          </span>
          <span class="city-text">
            <span class="city-name">{{ c.name }}</span>
            <span class="city-meta">{{ c.meta }}</span>
          </span>
          <AppIcon name="arrow-up-right" class="city-arrow" :size="18" />
        </button>
      </div>
    </section>

    <!-- ── CTA ──────────────────────── -->
    <section class="cta-band">
      <div class="cta-inner">
        <h2 class="cta-title">Siap pindah? Mulai cari kosmu sekarang.</h2>
        <p class="cta-sub">Gratis, tanpa daftar, dan langsung menampilkan data dari Google Maps.</p>
        <button class="btn-light-lg" @click="goCity('')">
          Jelajahi kos
          <AppIcon name="arrow-right" :size="18" />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import { fetchStats } from '../services/api.js'

const emit = defineEmits(['go-dashboard'])
const toast = inject('toast')

const city = ref('')

const popularCities = ['Bandung', 'Jakarta', 'Yogyakarta', 'Surabaya', 'Malang', 'Semarang']

const cityCards = [
  { name: 'Bandung', meta: '±3.500 kos · Jawa Barat' },
  { name: 'Jakarta', meta: '±4.800 kos · DKI Jakarta' },
  { name: 'Yogyakarta', meta: '±2.900 kos · DI Yogyakarta' },
  { name: 'Surabaya', meta: '±2.200 kos · Jawa Timur' },
  { name: 'Malang', meta: '±1.800 kos · Jawa Timur' },
  { name: 'Semarang', meta: '±1.400 kos · Jawa Tengah' },
]

const heroImg = 'https://picsum.photos/seed/kos-finder-hero/900/1150'
const imgRoom1 = 'https://picsum.photos/seed/kos-room-1/1000/700'
const imgRoom2 = 'https://picsum.photos/seed/kos-room-2/800/1000'
const altHero = 'Suasana kamar kos yang hangat dan nyaman'
const altRoom1 = 'Kamar kos dengan pencahayaan alami'
const altRoom2 = 'Sudut kamar kos yang rapi dan modern'

const stats = ref({ total: '1.200+', cities: '30+', rating: '4,6' })

function formatNum(n) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function goCity(c) {
  emit('go-dashboard', c.trim())
}

function submitSearch() {
  const value = city.value.trim()
  if (!value) {
    toast('Masukkan nama kota terlebih dahulu', 'info')
    return
  }
  goCity(value)
}

onMounted(async () => {
  try {
    const s = await fetchStats()
    if (s && s.total != null) stats.value.total = formatNum(s.total) + '+'
    if (s && s.cities.length) stats.value.cities = String(s.cities.length) + '+'
    if (s && s.avgRating) stats.value.rating = s.avgRating.toFixed(1).replace('.', ',')
  } catch {
    // backend offline — biarkan nilai placeholder
  }
})
</script>

<style scoped>
/* ── Hero ─────────────────────────── */
.hero {
  position: relative;
  background: var(--dark);
  color: #fff;
  overflow: hidden;
  border-radius: 0 0 44px 44px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-photo {
  position: absolute;
  right: -6%;
  top: -10%;
  width: 52%;
  height: 130%;
  object-fit: cover;
  opacity: 0.5;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.9), transparent 85%);
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.9), transparent 85%);
}

.hero-tint {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(70% 80% at 78% 20%, rgba(200, 83, 27, 0.22), transparent 60%),
    radial-gradient(55% 65% at 8% 90%, rgba(200, 83, 27, 0.14), transparent 65%),
    linear-gradient(100deg, var(--dark) 30%, rgba(34, 27, 19, 0.82));
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.blob-a {
  width: 380px;
  height: 380px;
  left: -120px;
  top: -80px;
  background: radial-gradient(circle, rgba(224, 161, 27, 0.35), transparent 70%);
}

.blob-b {
  width: 300px;
  height: 300px;
  right: 22%;
  bottom: -140px;
  background: radial-gradient(circle, rgba(200, 83, 27, 0.35), transparent 70%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 20px 120px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 56px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 8px 16px;
  margin-bottom: 28px;
}

.hero-badge .icon {
  color: var(--gold);
}

.hero-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 5.4vw, 4.2rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
  max-width: 14ch;
  text-wrap: balance;
}

.hero-title em {
  font-style: italic;
  font-weight: 500;
  background: linear-gradient(100deg, #f0a968, #c8531b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  margin-top: 22px;
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.72);
  max-width: 46ch;
}

.hero-search {
  margin-top: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 8px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.hero-search:focus-within {
  border-color: rgba(224, 161, 27, 0.55);
  box-shadow: 0 0 0 4px rgba(224, 161, 27, 0.18);
}

.search-mark {
  color: rgba(255, 255, 255, 0.45);
  margin-left: 10px;
  flex: 0 0 auto;
}

.hero-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-family: var(--font-body);
  font-size: 15.5px;
  padding: 10px 6px;
  min-width: 0;
}

.hero-search input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.hero-search button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 12px;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
}

.hero-search button:hover {
  background: #e0631f;
  transform: translateY(-1px);
}

.hero-popular {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.popular-label {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.popular-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 13px;
  border-radius: 999px;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.popular-chip:hover {
  background: rgba(200, 83, 27, 0.25);
  border-color: rgba(200, 83, 27, 0.6);
  color: #fff;
}

/* Hero visual */
.hero-visual {
  position: relative;
}

.hero-card-main {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: var(--shadow-lg);
  transform: rotate(1.5deg);
}

.hero-card-main img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  display: block;
}

.hero-card-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20, 15, 10, 0.65), transparent 45%);
}

.hero-card-live {
  position: absolute;
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  background: rgba(20, 15, 10, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 7px 14px;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #58c08b;
  box-shadow: 0 0 0 4px rgba(88, 192, 139, 0.25);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(88, 192, 139, 0.25); }
  50% { box-shadow: 0 0 0 8px rgba(88, 192, 139, 0.08); }
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  color: var(--ink);
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: var(--shadow-lg);
}

.float-card strong {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.float-card span {
  font-size: 11.5px;
  color: var(--muted);
  font-weight: 500;
}

.float-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--gold-soft);
  color: #b97d0b;
}

.float-icon-alt {
  background: var(--accent-soft);
  color: var(--accent);
}

.float-top {
  top: 26px;
  left: -52px;
  animation: float 5s ease-in-out infinite;
}

.float-bottom {
  bottom: 34px;
  right: -44px;
  animation: float 6s ease-in-out 1s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ── Stats band ───────────────────── */
.stats-band {
  max-width: 1160px;
  margin: -56px auto 0;
  position: relative;
  z-index: 5;
  padding: 0 20px;
}

.stats-inner {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow-lg);
  padding: 34px 28px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

/* ── Sections ─────────────────────── */
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 20px 60px;
}

.section-alt {
  padding-top: 72px;
}

.section-head {
  max-width: 620px;
  margin-bottom: 48px;
}

.section-head.center {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.eyebrow {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 14px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 3.6vw, 2.7rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  text-wrap: balance;
}

.section-sub {
  margin-top: 16px;
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 52ch;
}

/* ── Bento features ───────────────── */
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 20px;
}

.bento-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.bento-card:not(.bento-photo):hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--line-strong);
}

.bento-photo {
  grid-column: span 2;
  justify-content: flex-end;
  padding: 0;
  min-height: 300px;
}

.bento-photo-tall {
  grid-column: span 1;
}

.bento-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bento-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(22, 16, 10, 0.78), transparent 55%);
}

.bento-caption {
  position: relative;
  color: #fff;
  padding: 26px;
  max-width: 420px;
}

.bento-caption h3 {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.bento-caption p {
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
}

.bento-accent {
  background: linear-gradient(150deg, var(--accent) 0%, #a63e10 100%);
  border-color: transparent;
  color: #fff;
  justify-content: flex-end;
}

.bento-accent h3,
.bento-accent p {
  position: relative;
}

.bento-accent h3 {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.bento-accent p {
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
}

.bento-card h3 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.bento-card > p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--muted);
}

.bento-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 8px;
}

.bento-accent .bento-icon {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

/* ── Steps ────────────────────────── */
.steps {
  display: flex;
  align-items: stretch;
  gap: 24px;
}

.step {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 34px 30px;
  transition: transform 0.25s, box-shadow 0.25s;
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.step-num {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 800;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 6px 14px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.step-body h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.step-body p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--muted);
}

.step-connector {
  display: flex;
  align-items: center;
  color: var(--line-strong);
  flex: 0 0 auto;
}

.cta-row {
  margin-top: 40px;
  text-align: center;
}

.btn-primary-lg {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 34px;
  border-radius: 14px;
  box-shadow: var(--shadow-accent);
  transition: background 0.2s, transform 0.15s;
}

.btn-primary-lg:hover {
  background: var(--accent-strong);
  transform: translateY(-2px);
}

/* ── Cities ───────────────────────── */
.city-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.city-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 22px 52px 22px 24px;
  text-align: left;
  color: var(--ink);
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.city-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(200, 83, 27, 0.4);
}

.city-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 13px;
  background: var(--accent-soft);
  color: var(--accent);
}

.city-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.city-name {
  font-family: var(--font-display);
  font-size: 16.5px;
  font-weight: 700;
}

.city-meta {
  display: block;
  font-size: 12.5px;
  color: var(--muted);
}

.city-arrow {
  position: absolute;
  right: 20px;
  color: var(--line-strong);
  transition: color 0.2s, transform 0.2s;
}

.city-card:hover .city-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

/* ── CTA band ─────────────────────── */
.cta-band {
  max-width: 1200px;
  margin: 40px auto 96px;
  padding: 0 20px;
}

.cta-inner {
  position: relative;
  overflow: hidden;
  background: var(--dark);
  color: #fff;
  border-radius: var(--r-xl);
  padding: 76px 40px;
  text-align: center;
}

.cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 90% at 20% 10%, rgba(200, 83, 27, 0.35), transparent 60%),
    radial-gradient(50% 80% at 85% 90%, rgba(224, 161, 27, 0.22), transparent 60%);
  pointer-events: none;
}

.cta-title {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.6vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  text-wrap: balance;
}

.cta-sub {
  position: relative;
  margin: 14px auto 30px;
  font-size: 15.5px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 46ch;
}

.btn-light-lg {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  color: var(--ink);
  border: none;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 34px;
  border-radius: 14px;
  transition: transform 0.15s, box-shadow 0.2s;
}

.btn-light-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
}

/* ── Responsive ───────────────────── */
@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 64px;
  }

  .hero-visual {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }

  .float-top { left: -10px; }
  .float-bottom { right: -8px; }

  .bento {
    grid-template-columns: 1fr 1fr;
  }

  .bento-photo,
  .bento-photo-tall {
    grid-column: span 1;
  }

  .steps {
    flex-direction: column;
  }

  .step-connector {
    transform: rotate(90deg);
    justify-content: center;
  }

  .city-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .hero {
    border-radius: 0 0 28px 28px;
  }

  .hero-inner {
    padding: 48px 20px 90px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-sub {
    font-size: 15px;
  }

  .hero-search {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-search button {
    justify-content: center;
  }

  .hero-card-main img {
    height: 340px;
  }

  .stats-inner {
    grid-template-columns: 1fr 1fr;
    padding: 26px 20px;
  }

  .stat-value {
    font-size: 26px;
  }

  .section {
    padding: 72px 20px 44px;
  }

  .bento {
    grid-template-columns: 1fr;
  }

  .bento-photo,
  .bento-photo-tall {
    grid-column: span 1;
    min-height: 240px;
  }

  .city-grid {
    grid-template-columns: 1fr;
  }

  .cta-inner {
    padding: 52px 24px;
  }
}
</style>
