<template>
  <div class="filter-bar">
    <div class="section scrape-section">
      <div class="section-label">
        <span class="label-icon">⚡</span>
        <span>Scrape data baru</span>
      </div>
      <div class="scrape-row">
        <input
          v-model="city"
          class="input"
          placeholder="Kota (contoh: Bandung, Jakarta)"
          @keyup.enter="emitScrape"
        />
        <input
          v-model="keyword"
          class="input input-keyword"
          placeholder="Keyword (contoh: kos kosan)"
          @keyup.enter="emitScrape"
        />
        <input
          v-model="scrapeDistrict"
          class="input input-district"
          placeholder="Kecamatan/Kelurahan (opsional)"
          @keyup.enter="emitScrape"
        />
        <button class="btn btn-primary" @click="emitScrape" :disabled="loading || !city">
          <span v-if="loading" class="spinner"></span>
          <span v-else>🔍</span>
          <span>{{ loading ? 'Mencari...' : 'Cari' }}</span>
        </button>
      </div>
    </div>

    <div class="section filter-section">
      <div class="section-label">
        <span class="label-icon">🎛️</span>
        <span>Filter &amp; urutkan</span>
      </div>
      <div class="filter-row">
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input
            v-model="search"
            placeholder="Cari nama, kota, atau kecamatan..."
            @input="emitFilter"
          />
        </div>
        <input
          v-model="filterCity"
          class="input input-city"
          placeholder="Kota / Kecamatan"
          @input="emitFilter"
        />
        <input
          v-model="filterDistrict"
          class="input input-district"
          placeholder="Kecamatan/Kelurahan"
          @input="emitFilter"
        />
        <select v-model="minRating" class="select" @change="emitFilter" title="Rating minimal">
          <option value="">Semua rating</option>
          <option value="2">2★ ke atas</option>
          <option value="3">3★ ke atas</option>
          <option value="4">4★ ke atas</option>
          <option value="4.5">4.5★ ke atas</option>
        </select>
        <select v-model="sort" class="select" @change="emitFilter" title="Urutkan">
          <option value="created_at">Terbaru</option>
          <option value="rating">Rating tertinggi</option>
          <option value="name">Nama (A-Z)</option>
        </select>
        <button
          v-if="hasActiveFilter"
          class="btn btn-ghost"
          @click="resetFilters"
          title="Reset filter"
        >
          ✕ Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({ loading: Boolean, filters: Object })
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

const hasActiveFilter = computed(() => !!(search.value || filterCity.value || filterDistrict.value || minRating.value || sort.value !== 'created_at'))

function emitScrape() {
  emit('scrape', {
    city: city.value,
    keyword: keyword.value,
    district: scrapeDistrict.value || undefined,
  })
}

function emitFilter() {
  emit('filter', {
    search: search.value || undefined,
    city: filterCity.value || undefined,
    district: filterDistrict.value || undefined,
    min_rating: minRating.value ? Number(minRating.value) : undefined,
    sort: sort.value,
  })
}

function resetFilters() {
  search.value = ''
  filterCity.value = ''
  filterDistrict.value = ''
  minRating.value = ''
  sort.value = 'created_at'
  emitFilter()
}
</script>

<style scoped>
.filter-bar {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.label-icon {
  font-size: 14px;
}

.scrape-row,
.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.input,
.select {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
}

.input:focus,
.select:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.input {
  flex: 2;
  min-width: 160px;
}

.input-keyword {
  flex: 1.5;
  min-width: 140px;
}

.input-district {
  flex: 1.2;
  min-width: 160px;
}

.input-city {
  flex: 1;
  min-width: 140px;
}

.select {
  flex: 0 1 auto;
  min-width: 140px;
  cursor: pointer;
}

.search-box {
  flex: 3;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 18px;
  color: var(--text-light);
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 10px 14px 10px 36px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.search-box input:focus {
  border-color: var(--primary);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}

.btn-primary {
  flex: 0 0 auto;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 9px 16px;
}

.btn-ghost:hover {
  color: var(--danger);
  border-color: rgba(239, 68, 68, 0.4);
  background: #fef2f2;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
