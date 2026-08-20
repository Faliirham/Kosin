<template>
  <div class="filter-bar">
    <section class="scrape-section" aria-label="Cari kos baru">
      <header class="section-head">
        <span class="section-label">
          <AppIcon name="compass" :size="16" />
          Cari kos baru
        </span>
      </header>

      <form class="scrape-form" @submit.prevent="emitScrape">
        <div class="form-group">
          <span class="group-label">Lokasi</span>
          <div class="group-fields group-location">
            <div class="field field-grow">
              <AppIcon name="map-pin" class="field-icon" :size="17" />
              <input
                v-model="city"
                class="input"
                placeholder="Kota — Bandung, Jakarta…"
                aria-label="Nama kota"
                required
              />
            </div>
            <div class="field field-district">
              <AppIcon name="buildings" class="field-icon" :size="17" />
              <input
                v-model="scrapeDistrict"
                class="input"
                placeholder="Kecamatan (opsional)"
                aria-label="Kecamatan"
              />
            </div>
            <div class="field field-kelurahan">
              <AppIcon name="map" class="field-icon" :size="17" />
              <input
                v-model="scrapeKelurahan"
                class="input"
                placeholder="Kelurahan (opsional)"
                aria-label="Kelurahan"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <span class="group-label">Kata kunci</span>
          <div class="group-fields group-keyword">
            <div class="field field-keyword">
              <AppIcon name="search" class="field-icon" :size="17" />
              <input
                v-model="keyword"
                class="input"
                placeholder="Kos kosan, kos putri, indekos…"
                aria-label="Keyword pencarian"
              />
            </div>
            <button class="btn btn-primary" type="submit" :disabled="loading || scraping || !city">
              <span v-if="loading || scraping" class="spinner"></span>
              <AppIcon v-else name="search" :size="17" />
              <span>{{ loading || scraping ? 'Mencari…' : 'Cari' }}</span>
            </button>
          </div>
        </div>
      </form>

      <p v-if="(loading || scraping) && city" class="scrape-status">
        <AppIcon name="compass" :size="13" />
        Mencari kos di {{ locationLabel }} — data ditarik langsung dari Google Maps, ini butuh beberapa saat.
      </p>

      <div v-if="recentList.length" class="recent-row">
        <span class="recent-label">
          <AppIcon name="clock" :size="12" />
          Pencarian terakhir
        </span>
        <button
          v-for="(r, i) in recentList"
          :key="`${r.city}-${r.district}-${r.kelurahan}-${i}`"
          class="recent-chip"
          :title="`Cari lagi ${recentLabel(r)}`"
          @click="applyRecent(r)"
        >
          {{ recentLabel(r) }}
        </button>
        <button class="recent-clear" title="Hapus semua riwayat pencarian" aria-label="Hapus riwayat pencarian" @click="clearAllRecent">
          <AppIcon name="close" :size="12" />
        </button>
      </div>
    </section>

    <div class="divider"></div>

    <section class="filter-section" aria-label="Filter dan urutkan">
      <header class="section-head">
        <span class="section-label">
          <AppIcon name="filter" :size="15" />
          Filter &amp; urutkan
        </span>
      </header>
      <div class="filter-row">
        <div class="field field-search">
          <AppIcon name="search" class="field-icon" :size="16" />
          <input
            v-model="search"
            class="input"
            placeholder="Cari nama, alamat, atau area…"
            aria-label="Cari kos"
            @input="emitFilter"
          />
        </div>
        <div class="field">
          <input
            v-model="filterCity"
            class="input"
            placeholder="Kota"
            aria-label="Filter kota"
            @input="emitFilter"
          />
        </div>
        <div class="field">
          <input
            v-model="filterDistrict"
            class="input"
            placeholder="Kecamatan"
            aria-label="Filter kecamatan"
            @input="emitFilter"
          />
        </div>
        <div class="field">
          <input
            v-model="filterKelurahan"
            class="input"
            placeholder="Kelurahan"
            aria-label="Filter kelurahan"
            @input="emitFilter"
          />
        </div>
        <select v-model="minRating" class="select" @change="emitFilterNow" aria-label="Rating minimal">
          <option value="">Semua rating</option>
          <option value="2">2★ ke atas</option>
          <option value="3">3★ ke atas</option>
          <option value="4">4★ ke atas</option>
          <option value="4.5">4,5★ ke atas</option>
        </select>
        <select v-model="sort" class="select" @change="emitFilterNow" aria-label="Urutkan">
          <option value="created_at">Terbaru</option>
          <option value="rating">Rating tertinggi</option>
          <option value="name">Nama (A-Z)</option>
        </select>
        <button
          class="btn btn-fav"
          :class="{ active: favoritesOnly }"
          :aria-pressed="favoritesOnly"
          :title="favoritesOnly ? 'Tampilkan semua kos' : 'Tampilkan hanya kos favorit'"
          @click="toggleFavorites"
        >
          <AppIcon name="heart" :size="14" :filled="favoritesOnly" />
          <span>Favorit</span>
          <span v-if="favCount" class="fav-count">{{ favCount }}</span>
        </button>
        <button
          v-if="hasActiveFilter"
          class="btn btn-reset"
          @click="resetFilters"
          title="Reset filter"
        >
          <AppIcon name="close" :size="14" />
          Reset
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppIcon from './AppIcon.vue'
import { favoritesCount } from '../utils/favorites.js'
import { recentSearches, clearRecentSearches } from '../utils/history.js'

const props = defineProps({ loading: Boolean, scraping: Boolean, filters: Object, initialCity: String })
const emit = defineEmits(['scrape', 'filter'])

const city = ref('')
const keyword = ref('kos kosan')
const scrapeDistrict = ref('')
const scrapeKelurahan = ref('')
const search = ref('')
const filterCity = ref('')
const filterDistrict = ref('')
const filterKelurahan = ref('')
const minRating = ref('')
const sort = ref('created_at')
const favoritesOnly = ref(false)

const favCount = computed(() => favoritesCount())

watch(() => props.filters, (f) => {
  if (!f) return
  search.value = f.search || ''
  filterCity.value = f.city || ''
  filterDistrict.value = f.district || ''
  filterKelurahan.value = f.kelurahan || ''
  minRating.value = f.min_rating != null ? String(f.min_rating) : ''
  sort.value = f.sort || 'created_at'
  favoritesOnly.value = !!f.favorites_only
}, { deep: true })

onMounted(() => {
  if (props.initialCity) city.value = props.initialCity
})

const locationLabel = computed(() => {
  return [city.value, scrapeDistrict.value, scrapeKelurahan.value].filter(Boolean).join(', ')
})

const hasActiveFilter = computed(() => !!(
  search.value ||
  filterCity.value ||
  filterDistrict.value ||
  filterKelurahan.value ||
  minRating.value ||
  sort.value !== 'created_at' ||
  favoritesOnly.value
))

function emitScrape() {
  emit('scrape', {
    city: city.value,
    keyword: keyword.value,
    district: scrapeDistrict.value || undefined,
    kelurahan: scrapeKelurahan.value || undefined,
  })
}

function buildFilterPayload() {
  return {
    search: search.value || undefined,
    city: filterCity.value || undefined,
    district: filterDistrict.value || undefined,
    kelurahan: filterKelurahan.value || undefined,
    min_rating: minRating.value ? Number(minRating.value) : undefined,
    sort: sort.value,
    favorites_only: favoritesOnly.value || undefined,
  }
}

function toggleFavorites() {
  favoritesOnly.value = !favoritesOnly.value
  emitFilterNow()
}

const recentList = computed(() => recentSearches())

function shortArea(v) {
  return (v || '').replace(/^(Kec\.|Kel\.|Kecamatan|Kelurahan)\s*/i, '')
}

function recentLabel(r) {
  return [r.city, r.district ? shortArea(r.district) : null, r.kelurahan ? shortArea(r.kelurahan) : null]
    .filter(Boolean)
    .join(' · ')
}

function applyRecent(r) {
  city.value = r.city
  scrapeDistrict.value = r.district || ''
  scrapeKelurahan.value = r.kelurahan || ''
  keyword.value = r.keyword || 'kos kosan'
  emitScrape()
}

function clearAllRecent() {
  clearRecentSearches()
}

let filterTimer = null

function emitFilter() {
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => emit('filter', buildFilterPayload()), 350)
}

function emitFilterNow() {
  clearTimeout(filterTimer)
  emit('filter', buildFilterPayload())
}

function resetFilters() {
  search.value = ''
  filterCity.value = ''
  filterDistrict.value = ''
  filterKelurahan.value = ''
  minRating.value = ''
  sort.value = 'created_at'
  favoritesOnly.value = false
  emitFilterNow()
}
</script>

<style scoped>
.filter-bar {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-head {
  display: flex;
  align-items: center;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.section-label .icon {
  color: var(--accent);
}

.scrape-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.group-fields {
  display: grid;
  gap: 10px;
}

.group-location {
  grid-template-columns: 2.1fr 1.3fr 1.3fr;
}

.group-keyword {
  grid-template-columns: 1fr auto;
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.divider {
  height: 1px;
  background: var(--line);
}

.scrape-status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--accent);
}

.scrape-status .icon {
  flex: 0 0 auto;
}

.recent-row {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.recent-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.recent-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-soft);
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}

.recent-chip:hover {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent-strong);
  transform: translateY(-1px);
}

.recent-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.recent-clear:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

.field {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 13px;
  color: var(--muted);
  pointer-events: none;
}

.field-grow { flex: 1; }
.field-district { flex: 1; }
.field-kelurahan { flex: 1; }

.field-keyword { flex: 1; }

.filter-row .field {
  flex: 1 1 150px;
  min-width: 150px;
}

.field-search {
  flex: 2.4;
  min-width: 220px;
}

.input,
.select {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  font-size: 14px;
  font-family: var(--font-body);
  background: var(--surface-2);
  color: var(--ink);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, transform 0.15s;
  outline: none;
}

.field-icon + .input {
  padding-left: 38px;
}

.input::placeholder {
  color: var(--muted);
  opacity: 0.85;
}

.input:focus,
.select:focus {
  border-color: var(--accent);
  background-color: var(--surface-strong);
  box-shadow: var(--focus);
}

.select {
  flex: 0 1 150px;
  min-width: 140px;
  width: auto;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

[data-theme='dark'] .select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238ea0ba' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14.5px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, color 0.2s;
}

.btn-primary {
  flex: 0 0 auto;
  background: var(--accent);
  color: #fff;
  box-shadow: var(--shadow-accent);
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-reset {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--line);
  padding: 10px 16px;
}

.btn-reset:hover {
  color: var(--danger);
  border-color: rgba(192, 57, 43, 0.5);
  background: var(--danger-soft);
}

.btn-fav {
  background: var(--surface-2);
  color: var(--muted);
  border: 1px solid var(--line);
  padding: 10px 16px;
}

.btn-fav:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-soft);
}

.btn-fav.active {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
  box-shadow: var(--shadow-accent);
}

.fav-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  background: rgba(255, 255, 255, 0.22);
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .group-location {
    grid-template-columns: 1fr 1fr;
  }

  .field-grow {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .filter-bar {
    padding: 18px 16px;
  }

  .group-location {
    grid-template-columns: 1fr;
  }

  .field-grow {
    grid-column: auto;
  }

  .group-keyword {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    width: 100%;
  }

  .filter-row .select {
    flex: 1 1 45%;
  }
}
</style>