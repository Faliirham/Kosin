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

    <div v-else-if="error" class="state-card state-error">
      <span class="state-mark">
        <AppIcon name="alert" :size="30" />
      </span>
      <h3>Gagal memuat detail</h3>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadDetail">
        <AppIcon name="arrow-right" :size="16" />
        Coba lagi
      </button>
    </div>

    <div v-else-if="kos" class="detail-card">
      <div class="detail-grid">
        <div class="gallery">
          <div class="gallery-main">
            <img
              v-if="activePhoto && !photoFailed"
              :src="activePhoto"
              :alt="`Foto ${kos.name}`"
              @error="photoFailed = true"
            />
            <div v-else class="gallery-fallback">
              <AppIcon name="buildings" :size="42" />
              <span>Belum ada foto</span>
            </div>
            <div v-if="kos.rating" class="gallery-rating">
              <AppIcon name="star" filled :size="14" />
              <strong>{{ kos.rating.toFixed(1) }}</strong>
              <span v-if="kos.total_reviews">· {{ kos.total_reviews }} ulasan</span>
            </div>
          </div>
          <div v-if="photoThumbs.length > 1" class="gallery-thumbs">
            <button
              v-for="(p, i) in photoThumbs"
              :key="i"
              class="thumb"
              :class="{ active: activePhoto === p }"
              @click="activePhoto = p; photoFailed = false"
            >
              <img :src="p" :alt="`Foto ${kos.name} ${i + 1}`" loading="lazy" @error="onThumbError" />
            </button>
          </div>
        </div>

        <div class="detail-main">
          <h2 class="detail-title">{{ kos.name }}</h2>

          <p class="detail-address">
            <AppIcon name="map-pin" :size="16" class="pin" />
            {{ kos.address || 'Alamat tidak tersedia' }}
          </p>

          <div class="info-list">
            <div v-if="kos.phone" class="info-item">
              <span class="info-icon">
                <AppIcon name="phone" :size="17" />
              </span>
              <div>
                <span class="info-label">Telepon</span>
                <a :href="`tel:${kos.phone.replace(/\s/g, '')}`" class="info-value link">{{ kos.phone }}</a>
              </div>
            </div>

            <div v-if="kos.website" class="info-item">
              <span class="info-icon">
                <AppIcon name="globe" :size="17" />
              </span>
              <div>
                <span class="info-label">Website</span>
                <a :href="kos.website" target="_blank" rel="noopener" class="info-value link">
                  {{ prettyUrl(kos.website) }}
                  <AppIcon name="arrow-up-right" :size="13" />
                </a>
              </div>
            </div>

            <div v-if="kos.price_range" class="info-item">
              <span class="info-icon">
                <AppIcon name="tag" :size="17" />
              </span>
              <div>
                <span class="info-label">Rentang harga</span>
                <span class="info-value">{{ kos.price_range }}</span>
              </div>
            </div>

            <div v-if="kos.opening_hours && kos.opening_hours.length" class="info-item info-item-hours">
              <span class="info-icon">
                <AppIcon name="clock" :size="17" />
              </span>
              <div>
                <span class="info-label">Jam buka</span>
                <ul class="hours-list">
                  <li v-for="hour in kos.opening_hours" :key="hour">{{ hour }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="actions">
            <button v-if="kos.google_maps_url" class="btn btn-maps" @click="openMaps">
              <AppIcon name="map-pin" :size="17" />
              Buka di Google Maps
              <AppIcon name="arrow-up-right" :size="15" />
            </button>
            <button class="btn btn-delete" @click="handleDelete">
              <AppIcon name="trash" :size="16" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import { fetchKosDetail, deleteKos } from '../services/api.js'

const props = defineProps({ kosId: String })

const navigate = inject('navigate')
const toast = inject('toast')

const kos = ref(null)
const loading = ref(true)
const error = ref('')
const activePhoto = ref('')
const photoFailed = ref(false)

const photoThumbs = computed(() => (kos.value?.photos || []).slice(0, 5))

function onThumbError(e) {
  e.target.style.display = 'none'
}

function prettyUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

async function loadDetail() {
  loading.value = true
  error.value = ''
  photoFailed.value = false
  try {
    kos.value = await fetchKosDetail(props.kosId)
    activePhoto.value = (kos.value.photos && kos.value.photos[0]) || ''
  } catch (e) {
    error.value = e.response?.data?.detail || e.message
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('Yakin ingin menghapus kos ini?')) return
  try {
    await deleteKos(props.kosId)
    toast('Kos berhasil dihapus', 'success')
    navigate('dashboard')
  } catch (e) {
    toast('Gagal menghapus kos', 'error')
  }
}

function openMaps() {
  window.open(kos.value.google_maps_url, '_blank', 'noopener')
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
  background: var(--gold-soft);
  color: #8f6410;
}

.chip-price {
  background: #e8f2ec;
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

.gallery {
  display: flex;
  flex-direction: column;
}

.gallery-main {
  position: relative;
  flex: 1;
  min-height: 440px;
  background: var(--dark);
}

.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  font-weight: 600;
  background:
    radial-gradient(80% 120% at 85% 0%, rgba(200, 83, 27, 0.25), transparent 60%),
    radial-gradient(70% 110% at 10% 100%, rgba(224, 161, 27, 0.2), transparent 60%),
    linear-gradient(120deg, #2c241a, #3a2f22);
}

.gallery-rating {
  position: absolute;
  left: 18px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(20, 15, 10, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #ffd66b;
  font-size: 14px;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.gallery-rating strong {
  font-family: var(--font-display);
  font-size: 17px;
}

.gallery-rating span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
}

.gallery-thumbs {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: var(--surface-2);
  border-top: 1px solid var(--line);
  overflow-x: auto;
}

.thumb {
  flex: 0 0 auto;
  width: 74px;
  height: 54px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  background: none;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb:hover {
  transform: translateY(-2px);
}

.thumb.active {
  border-color: var(--accent);
}

/* ── Main info ────────────────────── */
.detail-main {
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.detail-address {
  display: flex;
  gap: 7px;
  margin-top: 12px;
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
}

.pin {
  flex: 0 0 auto;
  margin-top: 2px;
  color: var(--accent);
}

.info-list {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 13px 16px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
}

.info-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 3px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  word-break: break-word;
}

.info-value.link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}

.info-value.link:hover {
  color: var(--accent-strong);
  text-decoration: underline;
}

.hours-list {
  list-style: none;
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.75;
  columns: 2;
  column-gap: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
}

.btn-maps {
  background: var(--accent);
  color: #fff;
  box-shadow: var(--shadow-accent);
}

.btn-maps:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.btn-maps:active {
  transform: translateY(0) scale(0.98);
}

.btn-delete {
  background: #fff;
  color: var(--danger);
  border: 1px solid rgba(192, 57, 43, 0.4);
}

.btn-delete:hover {
  background: var(--danger-soft);
  border-color: var(--danger);
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
  background: linear-gradient(90deg, #ece4d4 25%, #f6f2ea 50%, #ece4d4 75%);
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

/* ── State ────────────────────────── */
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

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .gallery-main {
    min-height: 300px;
  }
}

@media (max-width: 640px) {
  .detail {
    padding: 26px 16px 60px;
  }

  .detail-main {
    padding: 24px 20px;
  }

  .hours-list {
    columns: 1;
  }
}
</style>
