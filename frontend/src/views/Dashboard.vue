<template>
  <div class="dashboard">
    <FilterBar :loading="loading" @scrape="handleScrape" @filter="handleFilter" />

    <div v-if="!loading && !error && kosList.length" class="stats-row">
      <div class="stat stat-total">
        <span class="stat-num">{{ kosList.length }}</span>
        <span class="stat-label">kos tampil</span>
      </div>
      <div class="stat stat-gmaps">
        <span class="stat-num">{{ sourceCounts.gmaps }}</span>
        <span class="stat-label">sumber Google</span>
      </div>
      <div class="stat stat-osm">
        <span class="stat-num">{{ sourceCounts.osm }}</span>
        <span class="stat-label">sumber OSM</span>
      </div>
    </div>

    <div v-if="loading" class="loading-grid">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton skeleton-top"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>

    <div v-else-if="error" class="state-card state-error">
      <span class="state-icon">😵</span>
      <h3>Terjadi kesalahan</h3>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadKos()">Coba lagi</button>
    </div>

    <div v-else-if="kosList.length" class="content">
      <div class="kos-list">
        <KosCard
          v-for="kos in kosList"
          :key="kos.id"
          :kos="kos"
          @click="$emit('view-detail', kos.id)"
        />
      </div>
      <div class="map-container">
        <MapView :markers="kosList" />
      </div>
    </div>

    <div v-else class="state-card state-empty">
      <span class="state-icon">🏠</span>
      <h3>Belum ada data kos</h3>
      <p>Masukkan nama kota lalu klik <strong>Scrape</strong> untuk mencari kos-kosan terdekat dari Google Maps &amp; OpenStreetMap.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FilterBar from '../components/FilterBar.vue'
import KosCard from '../components/KosCard.vue'
import MapView from '../components/MapView.vue'
import { fetchKos, triggerScrape } from '../services/api.js'

defineEmits(['view-detail'])

const kosList = ref([])
const loading = ref(false)
const error = ref('')

const sourceCounts = computed(() => {
  const counts = { gmaps: 0, osm: 0 }
  kosList.value.forEach(k => {
    const key = k.source === 'gmaps' ? 'gmaps' : 'osm'
    counts[key] += 1
  })
  return counts
})

async function loadKos(params = {}) {
  loading.value = true
  error.value = ''
  try {
    const res = await fetchKos(params)
    kosList.value = res.data
  } catch (e) {
    error.value = 'Gagal memuat data: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

async function handleScrape({ city, keyword }) {
  loading.value = true
  error.value = ''
  try {
    await triggerScrape(city, keyword)
    await loadKos()
  } catch (e) {
    error.value = 'Gagal scrape: ' + (e.response?.data?.detail || e.message)
    loading.value = false
  }
}

function handleFilter(params) {
  loadKos(params)
}

onMounted(() => loadKos())
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Stats ─────────────────────────── */
.stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  box-shadow: var(--shadow-sm);
}

.stat-num {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-total .stat-num { color: var(--primary-dark); }
.stat-gmaps .stat-num { color: var(--google); }
.stat-osm .stat-num { color: var(--osm); }

/* ── Content ───────────────────────── */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.kos-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 72vh;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.map-container {
  height: 600px;
  border-radius: var(--radius);
  overflow: hidden;
  position: sticky;
  top: 84px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
}

/* ── Skeleton ──────────────────────── */
.loading-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.skeleton-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-top { width: 90px; height: 20px; }
.skeleton-title { width: 70%; height: 16px; }
.skeleton-line { width: 100%; height: 12px; }
.skeleton-line.short { width: 55%; }

@keyframes shimmer {
  to { background-position: -200% 0; }
}

/* ── State cards ───────────────────── */
.state-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 56px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
}

.state-icon {
  font-size: 42px;
  margin-bottom: 6px;
}

.state-card h3 {
  font-size: 17px;
  font-weight: 700;
}

.state-card p {
  font-size: 13.5px;
  color: var(--text-muted);
  max-width: 380px;
  line-height: 1.6;
}

.state-error p {
  color: var(--danger);
}

.btn-retry {
  margin-top: 10px;
  padding: 9px 22px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.btn-retry:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
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
</style>
