<template>
  <div class="filter-bar">
    <div class="scrape-section">
      <div class="scrape-label">
        <AppIcon name="compass" :size="16" />
        <span>Cari kos baru</span>
      </div>
      <form class="scrape-row" @submit.prevent="emitScrape">
        <div class="field field-grow">
          <AppIcon name="map-pin" class="field-icon" :size="17" />
          <input
            v-model="city"
            class="input"
            placeholder="Kota — Bandung, Jakarta…"
            aria-label="Nama kota"
          />
        </div>
        <div class="field field-keyword">
          <AppIcon name="search" class="field-icon" :size="17" />
          <input
            v-model="keyword"
            class="input"
            placeholder="Keyword — kos kosan murah"
            aria-label="Keyword pencarian"
          />
        </div>
        <div class="field field-district">
          <AppIcon name="buildings" class="field-icon" :size="17" />
          <input
            v-model="scrapeDistrict"
            class="input"
            placeholder="Kecamatan (opsional)"
            aria-label="Kecamatan atau kelurahan"
          />
        </div>
        <button class="btn btn-primary" type="submit" :disabled="loading || scraping || !city">
          <span v-if="loading || scraping" class="spinner"></span>
          <AppIcon v-else name="search" :size="17" />
          <span>{{ loading || scraping ? 'Mencari…' : 'Cari' }}</span>
        </button>
      </form>
      <p v-if="(loading || scraping) && city" class="scrape-status">
        <AppIcon name="compass" :size="13" />
        Mencari kos di {{ city }}{{ scrapeDistrict ? `, ${scrapeDistrict}` : '' }} — data ditarik langsung dari Google Maps, ini butuh beberapa saat.
      </p>
    </div>

    <div class="divider"></div>

    <div class="filter-section">
      <div class="filter-label">
        <AppIcon name="filter" :size="15" />
        <span>Filter &amp; urutkan</span>
      </div>
      <div class="filter-row">
        <div class="field field-search">
          <AppIcon name="search" class="field-icon" :size="16" />
          <input
            v-model="search"
            class="input"
            placeholder="Cari nama, kota, atau kecamatan…"
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
          v-if="hasActiveFilter"
          class="btn btn-reset"
          @click="resetFilters"
          title="Reset filter"
        >
          <AppIcon name="close" :size="14" />
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({ loading: Boolean, scraping: Boolean, filters: Object, initialCity: String })
const emit = defineEmits(['scrape', 'filter'])

const city = ref('')
const keyword = ref('kos kosan')
const scrapeDistrict = ref('')
const search = ref('')
const filterCity = ref('')
const filterDistrict = ref('')
const minRating = ref('')
const sort = ref('created_at')

watch(() => props.filters, (f) => {
  if (!f) return
  search.value = f.search || ''
  filterCity.value = f.city || ''
  filterDistrict.value = f.district || ''
  minRating.value = f.min_rating != null ? String(f.min_rating) : ''
  sort.value = f.sort || 'created_at'
}, { deep: true })

onMounted(() => {
  if (props.initialCity) city.value = props.initialCity
})

const hasActiveFilter = computed(() => !!(search.value || filterCity.value || filterDistrict.value || minRating.value || sort.value !== 'created_at'))

function emitScrape() {
  emit('scrape', {
    city: city.value,
    keyword: keyword.value,
    district: scrapeDistrict.value || undefined,
  })
}

function buildFilterPayload() {
  return {
    search: search.value || undefined,
    city: filterCity.value || undefined,
    district: filterDistrict.value || undefined,
    min_rating: minRating.value ? Number(minRating.value) : undefined,
    sort: sort.value,
  }
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
  minRating.value = ''
  sort.value = 'created_at'
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
  gap: 16px;
}

.scrape-label,
.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.scrape-label .icon,
.filter-label .icon {
  color: var(--accent);
}

.scrape-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
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

.field-grow { flex: 2.2; min-width: 180px; }
.field-keyword { flex: 1.6; min-width: 160px; }
.field-district { flex: 1.2; min-width: 160px; }

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
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
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
  background: #fff;
  box-shadow: var(--focus);
}

.select {
  flex: 0 1 auto;
  min-width: 140px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
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
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
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

@media (max-width: 760px) {
  .scrape-row {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }

  .filter-row .select {
    flex: 1 1 45%;
  }
}
</style>
