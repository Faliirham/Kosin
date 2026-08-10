<template>
  <div class="detail">
    <div class="detail-header">
      <button class="back-btn" @click="$emit('back')">← Kembali</button>
      <div v-if="kos" class="badges">
        <span class="source-badge" :class="`source-${kos.source || 'osm'}`">
          {{ (kos.source || 'osm') === 'gmaps' ? 'Google' : 'OpenStreetMap' }}
        </span>
        <span v-if="kos.city" class="chip chip-city">{{ kos.city }}</span>
        <span v-if="kos.price_range" class="chip chip-price">{{ kos.price_range }}</span>
      </div>
    </div>

    <div v-if="loading" class="state-card">
      <span class="spinner-lg"></span>
      <p>Memuat detail kos...</p>
    </div>

    <div v-else-if="error" class="state-card state-error">
      <span class="state-icon">😵</span>
      <h3>Gagal memuat detail</h3>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadDetail">Coba lagi</button>
    </div>

    <div v-else-if="kos" class="detail-card">
      <div v-if="kos.photos && kos.photos.length" class="photo-grid">
        <img
          v-for="(photo, i) in kos.photos"
          :key="i"
          :src="photo"
          :alt="`Foto ${kos.name} ${i + 1}`"
          loading="lazy"
        />
      </div>

      <div class="detail-body">
        <h2 class="detail-title">{{ kos.name }}</h2>

        <div v-if="kos.rating" class="rating-row">
          <span class="rating-badge">
            <span class="star">★</span> {{ kos.rating.toFixed(1) }}
          </span>
          <span v-if="kos.total_reviews" class="reviews">
            {{ kos.total_reviews }} ulasan
          </span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <strong>📍 Alamat</strong>
            <p>{{ kos.address || '-' }}</p>
          </div>
          <div class="info-item">
            <strong>📞 Telepon</strong>
            <p v-if="kos.phone"><a :href="`tel:${kos.phone.replace(/\s/g, '')}`">{{ kos.phone }}</a></p>
            <p v-else>-</p>
          </div>
          <div class="info-item">
            <strong>🌐 Website</strong>
            <p v-if="kos.website">
              <a :href="kos.website" target="_blank" rel="noopener">{{ prettyUrl(kos.website) }}</a>
            </p>
            <p v-else>-</p>
          </div>
          <div class="info-item">
            <strong>💰 Rentang Harga</strong>
            <p>{{ kos.price_range || '-' }}</p>
          </div>
        </div>

        <div v-if="kos.opening_hours && kos.opening_hours.length" class="hours">
          <h3>🕐 Jam Buka</h3>
          <ul>
            <li v-for="hour in kos.opening_hours" :key="hour">{{ hour }}</li>
          </ul>
        </div>

        <div class="actions">
          <button v-if="kos.google_maps_url" class="btn btn-maps" @click="openMaps">
            <span class="gmaps-icon">G</span>
            Buka di Google Maps
          </button>
          <button class="btn btn-delete" @click="handleDelete">
            🗑 Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { fetchKosDetail, deleteKos } from '../services/api.js'

const props = defineProps({ kosId: String })
const emit = defineEmits(['back'])
const toast = inject('toast')

const kos = ref(null)
const loading = ref(true)
const error = ref('')

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
  try {
    kos.value = await fetchKosDetail(props.kosId)
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
    emit('back')
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.back-btn {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  box-shadow: var(--shadow-sm);
}

.back-btn:hover {
  background: var(--primary-light);
  transform: translateX(-2px);
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.source-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 5px 12px;
  border-radius: 999px;
}

.source-gmaps {
  background: rgba(66, 133, 244, 0.12);
  color: #1a73e8;
}

.source-osm {
  background: rgba(76, 175, 80, 0.14);
  color: #2e7d32;
}

.chip {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
}

.chip-city {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.chip-price {
  background: #ecfdf5;
  color: #047857;
}

.detail-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  padding: 16px;
  background: #0f172a;
}

.photo-grid img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.25s;
}

.photo-grid img:hover {
  transform: scale(1.03);
}

.detail-body {
  padding: 24px 28px 28px;
}

.detail-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
  font-size: 16px;
  font-weight: 800;
  padding: 5px 14px;
  border-radius: 999px;
}

.star {
  color: var(--rating);
}

.reviews {
  font-size: 13px;
  color: var(--text-muted);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.info-item {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
}

.info-item strong {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.info-item p {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.info-item a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.info-item a:hover {
  text-decoration: underline;
}

.hours {
  background: var(--primary-light);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 24px;
}

.hours h3 {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--primary-dark);
}

.hours ul {
  list-style: none;
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
}

.btn-maps {
  background: linear-gradient(135deg, #4285f4, #5b8def);
  color: #fff;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-maps:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(66, 133, 244, 0.4);
}

.gmaps-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #fff;
  color: #4285f4;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 800;
}

.btn-delete {
  background: #fff;
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.btn-delete:hover {
  background: #fef2f2;
  border-color: var(--danger);
}

/* ── State ─────────────────────────── */
.state-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 56px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.state-icon {
  font-size: 40px;
}

.state-card h3 {
  font-size: 16px;
}

.state-card p {
  font-size: 13.5px;
  color: var(--text-muted);
}

.state-error p {
  color: var(--danger);
}

.btn-retry {
  padding: 9px 22px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.spinner-lg {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-body {
    padding: 20px;
  }
}
</style>
