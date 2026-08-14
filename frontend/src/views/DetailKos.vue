<template>
  <div class="detail">
    <div class="detail-top">
      <button class="back-btn" @click="navigate('dashboard')">
        <AppIcon name="arrow-left" :size="16" />
        Kembali
      </button>
      <div v-if="kos" class="badges">
        <span class="chip chip-source" :class="`chip-source-${kos.source || 'osm'}`">
          <AppIcon name="layers" :size="12" />
          {{ (kos.source || 'osm') === 'gmaps' ? 'Google' : 'OpenStreetMap' }}
        </span>
        <span v-if="kos.city" class="chip chip-city">{{ kos.city }}</span>
        <span v-if="kos.district" class="chip chip-district">{{ kos.district }}</span>
        <span v-if="kos.price_range" class="chip chip-price">
          <AppIcon name="tag" :size="12" />
          {{ kos.price_range }}
        </span>
      </div>
    </div>

    <div v-if="loading" class="detail-loading">
      <div class="skeleton skeleton-hero"></div>
      <div class="detail-loading-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
      </div>
    </div>

    <StateCard
      v-else-if="error"
      type="error"
      icon="alert"
      title="Gagal memuat detail"
      :message="error"
    >
      <button class="btn-retry" @click="loadDetail">
        <AppIcon name="arrow-right" :size="16" />
        Coba lagi
      </button>
    </StateCard>

    <div v-else-if="kos" class="detail-card">
      <div class="detail-grid">
        <GallerySection
          :photos="kos.photos || []"
          :name="kos.name"
          :rating="kos.rating"
          :total-reviews="kos.total_reviews"
        />
        <InfoSection :kos="kos" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import StateCard from '../components/StateCard.vue'
import GallerySection from '../components/detail/GallerySection.vue'
import InfoSection from '../components/detail/InfoSection.vue'
import { fetchKosDetail } from '../services/api.js'

const props = defineProps({ kosId: String })

const navigate = inject('navigate')

const kos = ref(null)
const loading = ref(true)
const error = ref('')

async function loadDetail() {
  loading.value = true
  error.value = ''
  try {
    kos.value = await fetchKosDetail(props.kosId)
  } catch (e) {
    error.value = e.response?.data?.detail || e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => loadDetail())
</script>

<style scoped>
.detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  transition: background 0.2s, transform 0.15s;
}

.back-btn:hover {
  background: var(--accent-soft);
  transform: translateX(-2px);
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 10px;
}

.chip-source-gmaps {
  background: rgba(26, 115, 232, 0.12);
  color: var(--google);
}

.chip-source-osm {
  background: rgba(47, 125, 79, 0.13);
  color: var(--osm);
}

.chip-city {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.chip-district {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.chip-price {
  background: var(--success-soft);
  color: var(--success);
}

/* ── Card ─────────────────────────── */
.detail-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
}

/* ── Loading skeleton ─────────────── */
.detail-loading {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.skeleton {
  border-radius: 8px;
  background: var(--skeleton);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-hero {
  height: 340px;
  border-radius: 0;
}

.detail-loading-body {
  padding: 26px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-title { width: 55%; height: 24px; }
.skeleton-line { width: 100%; height: 14px; }
.skeleton-line.short { width: 40%; }

@keyframes shimmer {
  to { background-position: -200% 0; }
}

/* ── Action ───────────────────────── */
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

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .detail {
    padding: 26px 16px 60px;
  }
}
</style>
