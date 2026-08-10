<template>
  <div class="dashboard">
    <div class="dash-head">
      <div class="dash-heading">
        <span class="eyebrow">Jelajahi</span>
        <h1 class="dash-title">{{ activeCity ? `${activeCity} — kos di sekitarmu` : 'Kos-kosan di sekitarmu' }}</h1>
        <p class="dash-sub">
          {{ activeCity ? `Hasil pencarian untuk ${activeCity}` : 'Masukkan kota, lalu tekan cari untuk menarik data dari Google Maps.' }}
        </p>
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
          <span class="dash-stat-num dash-stat-osm">{{ sourceCounts.osm }}</span>
          <span class="dash-stat-label">OpenStreetMap</span>
        </div>
      </div>
    </div>

    <FilterBar
      :loading="loading"
      :filters="filters"
      :initial-city="initialCity"
      @scrape="handleScrape"
      @filter="handleFilter"
    />

    <div v-if="loading" class="loading-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton skeleton-photo"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>

    <div v-else-if="error" class="state-card state-error">
      <span class="state-mark">
        <AppIcon name="alert" :size="30" />
      </span>
      <h3>Terjadi kesalahan</h3>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadKos()">
        <AppIcon name="arrow-right" :size="16" />
        Coba lagi
      </button>
    </div>

    <div v-else-if="kosList.length" class="content">
      <div class="list-wrap">
        <div class="kos-list" :class="{ 'is-filtering': filtering }">
          <KosCard
            v-for="kos in kosList"
            :key="kos.id"
            :kos="kos"
            @click="openDetail(kos.id)"
          />
          <button v-if="total > kosList.length" class="btn-load-more" @click="loadMore" :disabled="loadingMore">
            <span v-if="loadingMore" class="spinner-sm"></span>
            <span>{{ loadingMore ? 'Memuat…' : `Muat lebih banyak (${kosList.length}/${total})` }}</span>
          </button>
        </div>
        <div v-if="filtering" class="list-overlay">
          <span class="spinner-md"></span>
          <span>Memfilter…</span>
        </div>
      </div>

      <div class="map-container">
        <MapView :markers="kosList" />
      </div>
    </div>

    <div v-else class="state-card state-empty">
      <span class="state-mark">
        <AppIcon name="buildings" :size="30" />
      </span>
      <h3>Belum ada data kos</h3>
      <p>Masukkan nama kota lalu klik <strong>Cari</strong> untuk menarik kos-kosan terdekat dari Google Maps.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import FilterBar from '../components/FilterBar.vue'
import KosCard from '../components/KosCard.vue'
import MapView from '../components/MapView.vue'
import AppIcon from '../components/AppIcon.vue'
import { fetchKos, triggerScrape } from '../services/api.js'

const props = defineProps({ prefillCity: { type: String, default: '' } })

const navigate = inject('navigate')
const toast = inject('toast')

const kosList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const filtering = ref(false)
const error = ref('')
const filters = ref({})
const page = ref(0)
const total = ref(0)

const PAGE_SIZE = 20

const initialCity = props.prefillCity || ''

const activeCity = computed(() => filters.value.city || initialCity || '')

const sourceCounts = computed(() => {
  const counts = { gmaps: 0, osm: 0 }
  kosList.value.forEach(k => {
    const key = k.source === 'gmaps' ? 'gmaps' : 'osm'
    counts[key] += 1
  })
  return counts
})

function openDetail(id) {
  navigate('detail', { id })
}

async function loadKos(params = {}, reset = true) {
  if (reset) page.value = 0
  loading.value = true
  loadingMore.value = false
  error.value = ''
  try {
    const res = await fetchKos({ ...params, limit: PAGE_SIZE, offset: page.value * PAGE_SIZE })
    if (reset) {
      kosList.value = res.data
    } else {
      kosList.value = kosList.value.concat(res.data)
    }
    total.value = res.total
  } catch (e) {
    error.value = 'Gagal memuat data: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

async function handleScrape({ city, keyword, district }) {
  loading.value = true
  error.value = ''
  try {
    await triggerScrape(city, keyword, district)
    filters.value = {
      ...filters.value,
      city,
      district: district || undefined,
      search: undefined,
    }
    await loadKos(filters.value, true)
  } catch (e) {
    error.value = 'Gagal scrape: ' + (e.response?.data?.detail || e.message)
    loading.value = false
  }
}

function handleFilter(params) {
  filters.value = { ...params }
  page.value = 0
  filtering.value = true
  error.value = ''
  fetchKos({ ...params, limit: PAGE_SIZE, offset: 0 })
    .then(res => {
      kosList.value = res.data
      total.value = res.total
    })
    .catch(e => {
      error.value = 'Gagal memuat data: ' + (e.response?.data?.detail || e.message)
    })
    .finally(() => {
      filtering.value = false
    })
}

async function loadMore() {
  if (loadingMore.value) return
  loadingMore.value = true
  try {
    const next = page.value + 1
    const res = await fetchKos({ ...filters.value, limit: PAGE_SIZE, offset: next * PAGE_SIZE })
    kosList.value = kosList.value.concat(res.data)
    total.value = res.total
    page.value = next
  } catch (e) {
    toast('Gagal memuat lebih banyak: ' + (e.response?.data?.detail || e.message), 'error')
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  if (initialCity) {
    handleScrape({ city: initialCity, keyword: 'kos kosan' })
  } else {
    loadKos()
  }
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
.dash-stat-osm { color: var(--osm); }

.dash-stat-label {
  font-size: 11px;
  color: var(--muted);
  font-weight: 600;
}

/* ── Content ──────────────────────── */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
}

.kos-list {
  display: flex;
  flex-direction: column;
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
  background: rgba(246, 242, 234, 0.4);
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

/* ── Skeleton ─────────────────────── */
.loading-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  padding-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #ece4d4 25%, #f6f2ea 50%, #ece4d4 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-photo {
  height: 120px;
  border-radius: 0;
}

.skeleton-title {
  width: 70%;
  height: 16px;
  margin: 6px 18px 0;
}

.skeleton-line {
  width: 100%;
  height: 12px;
  margin: 0 18px;
}

.skeleton-line.short {
  width: 55%;
}

@keyframes shimmer {
  to { background-position: -200% 0; }
}

/* ── State cards ──────────────────── */
.state-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 72px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}

.state-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 8px;
}

.state-card h3 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.state-card p {
  font-size: 14px;
  color: var(--muted);
  max-width: 400px;
  line-height: 1.7;
}

.state-error p {
  color: var(--danger);
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
  background: #f0d6bd;
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
  .content,
  .loading-grid {
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
  .dashboard {
    padding: 28px 16px 56px;
  }

  .dash-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .dash-stats {
    width: 100%;
  }

  .dash-stat {
    flex: 1;
  }
}
</style>
