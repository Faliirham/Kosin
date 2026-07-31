<template>
  <div class="detail">
    <button class="back-btn" @click="$emit('back')">← Kembali</button>

    <div v-if="loading" class="loading">Memuat...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="kos" class="detail-content">
      <h2>{{ kos.name }}</h2>

      <div class="info-grid">
        <div class="info-item">
          <strong>Alamat</strong>
          <p>{{ kos.address || '-' }}</p>
        </div>
        <div class="info-item">
          <strong>Kota</strong>
          <p>{{ kos.city || '-' }}</p>
        </div>
        <div class="info-item">
          <strong>Rating</strong>
          <p>{{ kos.rating ? kos.rating + ' ⭐' : '-' }}</p>
        </div>
        <div class="info-item">
          <strong>Total Review</strong>
          <p>{{ kos.total_reviews ?? '-' }}</p>
        </div>
        <div class="info-item">
          <strong>Telepon</strong>
          <p>{{ kos.phone || '-' }}</p>
        </div>
        <div class="info-item">
          <strong>Website</strong>
          <p v-if="kos.website"><a :href="kos.website" target="_blank">{{ kos.website }}</a></p>
          <p v-else>-</p>
        </div>
        <div class="info-item">
          <strong>Rentang Harga</strong>
          <p>{{ kos.price_range || '-' }}</p>
        </div>
      </div>

      <div v-if="kos.opening_hours" class="hours">
        <h3>Jam Buka</h3>
        <ul>
          <li v-for="hour in kos.opening_hours" :key="hour">{{ hour }}</li>
        </ul>
      </div>

      <div v-if="kos.photos && kos.photos.length" class="photos">
        <h3>Foto</h3>
        <div class="photo-grid">
          <img v-for="(photo, i) in kos.photos" :key="i" :src="photo" :alt="`Foto ${i + 1}`" />
        </div>
      </div>

      <div class="actions">
        <button class="delete-btn" @click="handleDelete">Hapus</button>
        <button class="maps-btn" v-if="kos.google_maps_url" @click="openMaps">Buka di Peta</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchKosDetail, deleteKos } from '../services/api.js'

const props = defineProps({ kosId: String })
defineEmits(['back'])

const kos = ref(null)
const loading = ref(true)
const error = ref('')

async function loadDetail() {
  loading.value = true
  error.value = ''
  try {
    kos.value = await fetchKosDetail(props.kosId)
  } catch (e) {
    error.value = 'Gagal memuat detail: ' + (e.response?.data?.detail || e.message)
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('Yakin hapus kos ini?')) return
  try {
    await deleteKos(props.kosId)
    alert('Berhasil dihapus')
  } catch (e) {
    alert('Gagal menghapus')
  }
}

function openMaps() {
  window.open(kos.value.google_maps_url, '_blank')
}

onMounted(() => loadDetail())
</script>

<style scoped>
.detail {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
.back-btn {
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 16px;
}
.detail-content h2 {
  margin-bottom: 20px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}
.info-item strong {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.hours, .photos {
  margin-bottom: 24px;
}
.hours h3, .photos h3 {
  margin-bottom: 8px;
}
.hours ul {
  list-style: none;
}
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}
.photo-grid img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}
.actions {
  display: flex;
  gap: 12px;
}
.delete-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.maps-btn {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}
.loading, .error {
  text-align: center;
  padding: 48px;
}
</style>
