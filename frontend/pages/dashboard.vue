<template>
  <div class="dashboard">
    <div class="dash-head">
      <div class="dash-heading">
        <span class="eyebrow">Jelajahi</span>
        <h1 class="dash-title">{{ activeCity ? `${activeCity} — kos di sekitarmu` : 'Kos-kosan di sekitarmu' }}</h1>
        <p class="dash-sub">{{ dashSub }}</p>
      </div>

      <div class="dash-stats" v-if="!loading && kosList.length">
        <div class="dash-stat">
          <span class="dash-stat-num">{{ total }}</span>
          <span class="dash-stat-label">kos tersedia</span>
        </div>
        <div class="dash-stat">
          <span class="dash-stat-num dash-stat-gmaps">{{ sourceCounts.gmaps }}</span>
          <span class="dash-stat-label">Google Maps</span>
        </div>
        <div class="dash-stat">
          <span class="dash-stat-num dash-stat-rating">{{ avgRating }}</span>
          <span class="dash-stat-label">rata-rata rating</span>
        </div>
      </div>

      <button v-if="kosList.length && !loading" class="btn-export" @click="exportCsv" :disabled="!displayKos.length || exporting">
        <span v-if="exporting" class="spinner-sm"></span>
        <AppIcon v-else name="arrow-down" :size="16" />
        <span>{{ exporting ? 'Mengekspor…' : 'Ekspor CSV' }}</span>
      </button>
    </div>

    <FilterBar
      :loading="loading"
      :scraping="scraping"
      :filters="filters"
      :initial-city="initialCity"
      @scrape="handleScrape"
      @filter="handleFilter"
    />

    <div v-if="scrapeAreas.length && !loading && !scraping" class="area-bar">
      <span class="area-bar-label">
        <AppIcon name="map-pin" :size="13" />
        {{ scrapeAreas.length }} area ditemukan
      </span>
      <span v-for="area in scrapeAreas" :key="area.district" class="area-chip">
        <span class="area-chip-name">{{ shortDistrict(area.district) }}</span>
        <span class="area-chip-count">{{ area.count }}</span>
      </span>
    </div>

    <SkeletonGrid v-if="loading || (scraping && !kosList.length)" />

    <StateCard
      v-else-if="error && !kosList.length"
      type="error"
      icon="alert"
      title="Terjadi kesalahan"
      :message="error"
    >
      <button class="btn-retry" @click="loadKos()">
        <AppIcon name="arrow-right" :size="16" />
        Coba lagi
      </button>
    </StateCard>

    <div v-else-if="kosList.length" class="content">
      <div class="list-wrap">
        <div class="kos-list" :class="{ 'is-filtering': filtering || (scraping && kosList.length) }">
          <TiltCard
            v-for="(kos, i) in displayKos"
            :key="kos.id"
            :max="5"
            :scale="1.01"
            :data-kos-id="kos.id"
            :class="{ 'is-active': activeId === kos.id }"
            @mouseenter="activeId = kos.id; mapRef?.focusMarker?.(kos.id)"
            @mouseleave="activeId = null"
          >
            <KosCard :kos="kos" :index="i" :active="activeId === kos.id" @click="openDetail(kos.id)" />
          </TiltCard>
          <button v-if="total > kosList.length" class="btn-load-more" @click="loadMore" :disabled="loadingMore">
            <span v-if="loadingMore" class="spinner-sm"></span>
            <span>{{ loadingMore ? 'Memuat…' : `Muat lebih banyak (${kosList.length}/${total})` }}</span>
          </button>
          <StateCard
            v-if="favoritesOnly && !displayKos.length"
            icon="heart"
            title="Belum ada kos favorit di daftar ini"
            message="Klik ikon hati pada kartu kos untuk menyimpannya. Favorit tersimpan di perangkat ini."
          />
        </div>
        <div v-if="filtering" class="list-overlay">
          <span class="spinner-md"></span>
          <span>Memfilter…</span>
        </div>
        <div v-else-if="scraping" class="list-overlay">
          <span class="spinner-md"></span>
          <span>Mencari data baru untuk {{ scrapingCity }}…</span>
        </div>
      </div>

      <div class="map-container">
        <ClientOnly>
          <MapView ref="mapRef" :markers="displayKos" :highlight-id="activeId" @select="onMarkerSelect" />
        </ClientOnly>
      </div>
    </div>

    <StateCard
      v-else
      icon="buildings"
      title="Belum ada data kos"
      message="Masukkan nama kota lalu klik Cari untuk menarik kos-kosan terdekat dari Google Maps."
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { fetchKos, triggerScrape } from '../utils/api.js'
import { isFavorite, favoriteIds } from '../utils/favorites.js'
import { addRecentSearch } from '../utils/history.js'
import { kosToCsv, downloadCsv } from '../utils/csv.js'
import { parseMonthlyPrice } from '../utils/price.js'

const route = useRoute()

const navigate = inject('navigate')
const toast = inject('toast')

const kosList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const exporting = ref(false)
const filtering = ref(false)
const scraping = ref(false)
const scrapingCity = ref('')
const scrapeAreas = ref([])
const mapRef = ref(null)
const activeId = ref(null)
const error = ref('')
const filters = ref({})
const page = ref(0)
const total = ref(0)

const PAGE_SIZE = 20

let requestSeq = 0
let scrapeSeq = 0

const initialCity = typeof route.query.city === 'string' ? route.query.city : ''

useHead({
  title: 'Jelajahi — Kos Finder',
})

const activeCity = computed(() => filters.value.city || initialCity || '')

const favoritesOnly = computed(() => !!filters.value.favorites_only)

function withFavorites(params) {
  if (!params.favorites_only) return params
  return { ...params, favorite_ids: [...favoriteIds()].join(',') }
}

const displayKos = computed(() => {
  let list = favoritesOnly.value ? kosList.value.filter(k => isFavorite(k)) : kosList.value

  const min = filters.value.price_min
  const max = filters.value.price_max
  if (min != null || max != null) {
    list = list.filter(k => {
      const price = parseMonthlyPrice(k.price_range)
      if (price == null) return true
      if (min != null && price < min) return false
      if (max != null && price > max) return false
      return true
    })
  }
  return list
})

const dashSub = computed(() => {
  if (loading.value || scraping.value) {
    return activeCity.value
      ? `Mencari data untuk ${activeCity.value} dari Google Maps — ini bisa butuh beberapa saat.`
      : 'Memuat data…'
  }

  if (activeCity.value) {
    return `Hasil pencarian untuk ${activeCity.value}`
  }

  if (kosList.value.length > 0) {
    return `Menampilkan ${total.value} kos dari ${kosList.value.length} yang tersedia`
  }

  return 'Masukkan nama kota, lalu tekan Cari untuk menarik data dari Google Maps.'
})

const sourceCounts = computed(() => {
  const counts = { gmaps: 0 }
  kosList.value.forEach(k => {
    if (k.source === 'gmaps') counts.gmaps += 1
  })
  return counts
})

const avgRating = computed(() => {
  const rated = kosList.value.filter(k => k.rating)
  if (!rated.length) return '—'
  const avg = rated.reduce((sum, k) => sum + k.rating, 0) / rated.length
  return avg.toFixed(1).replace('.', ',')
})

function shortDistrict(d) {
  return (d || '').replace(/^Kec\.\s*/i, '')
}

function openDetail(id) {
  navigate('detail', { id })
}

function onMarkerSelect(id) {
  activeId.value = id
  const el = document.querySelector(`[data-kos-id="${id}"]`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function exportCsv() {
  if (!displayKos.value.length || exporting.value) return
  exporting.value = true
  try {
    const params = withFavorites({ ...filters.value, limit: 100 })
    const first = await fetchKos({ ...params, offset: 0 })
    let rows = first.data
    for (let offset = 100; offset < first.total; offset += 100) {
      const page = await fetchKos({ ...params, offset })
      rows = rows.concat(page.data)
    }
    const city = activeCity.value || 'semua'
    const slug = String(city).toLowerCase().replace(/[^a-z0-9]+/gi, '-')
    downloadCsv(`kos-${slug}.csv`, kosToCsv(rows))
    toast(`${rows.length} kos diekspor ke CSV`, 'success')
  } catch (e) {
    toast('Gagal mengekspor CSV: ' + (e.response?.data?.detail || e.message), 'error')
  } finally {
    exporting.value = false
  }
}

async function loadKos(params = {}, reset = true) {
  const seq = ++requestSeq
  if (reset) page.value = 0
  loading.value = true
  loadingMore.value = false
  error.value = ''
  try {
    const res = await fetchKos(withFavorites({ ...params, limit: PAGE_SIZE, offset: page.value * PAGE_SIZE }))
    if (seq !== requestSeq) return
    if (reset) {
      kosList.value = res.data
    } else {
      kosList.value = kosList.value.concat(res.data)
    }
    total.value = res.total
  } catch (e) {
    if (seq !== requestSeq) return
    error.value = 'Gagal memuat data: ' + (e.response?.data?.detail || e.message)
  } finally {
    if (seq === requestSeq) loading.value = false
  }
}

function computeAreas(list) {
  const counts = {}
  for (const k of list) {
    if (k.district) counts[k.district] = (counts[k.district] || 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([district, count]) => ({ district, count }))
}

async function handleScrape({ city, keyword, district, kelurahan }) {
  const myScrape = ++scrapeSeq
  scraping.value = true
  scrapingCity.value = city
  scrapeAreas.value = []
  error.value = ''

  const params = { city, district: district || undefined, kelurahan: kelurahan || undefined }

  try {
    await triggerScrape(city, keyword, district, kelurahan)
  } catch (e) {
    if (myScrape !== scrapeSeq) return
    const msg = 'Gagal memulai scrape: ' + (e.response?.data?.detail || e.message)
    if (kosList.value.length) toast(msg, 'error')
    else error.value = msg
    scraping.value = false
    return
  }

  // Backend menjalankan scrape di latar belakang (respons cepat). Kita
  // polling list sampai data muncul agar user tak menunggu proses menit-an.
  const baseTotal = total.value
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  for (let i = 0; i < 10; i++) {
    if (myScrape !== scrapeSeq) return
    await sleep(2500)
    if (myScrape !== scrapeSeq) return
    await loadKos(params, true)
    if (total.value > baseTotal || (baseTotal === 0 && total.value > 0)) break
  }
  if (myScrape !== scrapeSeq) return

  addRecentSearch({ city, district, kelurahan, keyword })
  filters.value = {
    ...filters.value,
    city,
    district: params.district,
    kelurahan: params.kelurahan,
    search: undefined,
  }
  scrapeAreas.value = computeAreas(kosList.value)
  scraping.value = false
}

function handleFilter(params) {
  filters.value = { ...params }
  page.value = 0
  filtering.value = true
  error.value = ''
  scrapeAreas.value = []
  const seq = ++requestSeq
  fetchKos(withFavorites({ ...params, limit: PAGE_SIZE, offset: 0 }))
    .then(res => {
      if (seq !== requestSeq) return
      kosList.value = res.data
      total.value = res.total
    })
    .catch(e => {
      if (seq !== requestSeq) return
      error.value = 'Gagal memuat data: ' + (e.response?.data?.detail || e.message)
    })
    .finally(() => {
      if (seq === requestSeq) filtering.value = false
    })
}

async function loadMore() {
  if (loadingMore.value) return
  const seq = ++requestSeq
  loadingMore.value = true
  try {
    const next = page.value + 1
    const res = await fetchKos(withFavorites({ ...filters.value, limit: PAGE_SIZE, offset: next * PAGE_SIZE }))
    if (seq !== requestSeq) return
    kosList.value = kosList.value.concat(res.data)
    total.value = res.total
    page.value = next
  } catch (e) {
    if (seq === requestSeq) {
      toast('Gagal memuat lebih banyak: ' + (e.response?.data?.detail || e.message), 'error')
    }
  } finally {
    if (seq === requestSeq) loadingMore.value = false
  }
}

onMounted(() => {
  if (initialCity) {
    handleScrape({ city: initialCity, keyword: 'kos kosan' })
  } else {
    loadKos()
  }
})

onBeforeUnmount(() => {
  requestSeq += 1
  scrapeSeq += 1
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 20px 72px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Head ─────────────────────────── */
.dash-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.eyebrow {
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.dash-title {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-top: 6px;
}

.dash-sub {
  margin-top: 8px;
  font-size: 14.5px;
  color: var(--muted);
  max-width: 52ch;
}

.dash-stats {
  display: flex;
  gap: 12px;
}

.dash-stat {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  box-shadow: var(--shadow-sm);
}

.dash-stat-num {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.dash-stat-gmaps { color: var(--google); }
.dash-stat-rating { color: var(--accent); }

.dash-stat-label {
  font-size: 11px;
  color: var(--muted);
  font-weight: 600;
}

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 13.5px;
  font-weight: 700;
  padding: 11px 18px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}

.btn-export:hover:not(:disabled) {
  color: var(--accent-strong);
  border-color: var(--accent-border);
  background: var(--accent-soft);
  transform: translateY(-1px);
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Area bar ─────────────────────── */
.area-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-sm);
  padding: 10px 14px;
}

.area-bar-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-right: 4px;
}

.area-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-soft);
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 10px;
}

.area-chip-name {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.area-chip-count {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 11px;
}

/* ── Content ──────────────────────── */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
}

.kos-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  max-height: 76vh;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
  transition: opacity 0.2s;
}

.list-wrap {
  position: relative;
}

.kos-list.is-filtering {
  opacity: 0.55;
  pointer-events: none;
}

.list-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--overlay);
  border-radius: var(--r-lg);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
  pointer-events: none;
}

.spinner-md {
  width: 22px;
  height: 22px;
  border: 2.5px solid var(--line);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.map-container {
  height: 640px;
  border-radius: var(--r-lg);
  overflow: hidden;
  position: sticky;
  top: 86px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--line);
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 11px 24px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
  box-shadow: var(--shadow-accent);
  transition: background 0.2s, transform 0.15s;
}

.btn-retry:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 16px;
  border: 1.5px dashed var(--accent);
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 700;
  transition: background 0.2s, transform 0.15s;
}

.btn-load-more:hover {
  background: var(--accent-soft-strong);
  transform: translateY(-1px);
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid var(--accent-soft);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }

  .map-container {
    position: static;
    height: 420px;
    order: -1;
  }

  .kos-list {
    max-height: none;
  }
}

@media (max-width: 640px) {
  .map-container {
    height: 320px;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 28px 16px 56px;
  }

  .dash-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .dash-stats {
    width: 100%;
    gap: 8px;
  }

  .dash-stat {
    flex: 1;
    padding: 10px 12px;
  }

  .dash-stat-num {
    font-size: 19px;
  }

  .dash-stat-label {
    font-size: 10px;
  }

  .btn-export {
    width: 100%;
    justify-content: center;
  }
}
</style>
