<template>
  <div class="dashboard">
    <FilterBar
      :loading="loading"
      @scrape="handleScrape"
      @filter="handleFilter"
    />

    <div v-if="loading" class="loading">
      <p>Memuat data...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else class="content">
      <div class="kos-list">
        <KosCard
          v-for="kos in kosList"
          :key="kos.id"
          :kos="kos"
          @click="$emit('view-detail', kos.id)"
        />
        <div v-if="kosList.length === 0" class="empty">
          <p>Belum ada data. Scrape dulu!</p>
        </div>
      </div>
      <div class="map-container">
        <MapView :markers="kosList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FilterBar from '../components/FilterBar.vue'
import KosCard from '../components/KosCard.vue'
import MapView from '../components/MapView.vue'
import { fetchKos, triggerScrape } from '../services/api.js'

defineEmits(['view-detail'])

const kosList = ref([])
const loading = ref(false)
const error = ref('')

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
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
.kos-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.map-container {
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  position: sticky;
  top: 16px;
}
.loading, .error, .empty {
  text-align: center;
  padding: 48px;
  background: #fff;
  border-radius: 8px;
}
.error {
  color: #e74c3c;
}
</style>
