<template>
  <div class="map-wrap">
    <div ref="mapContainer" class="map"></div>
    <div v-if="error" class="map-error">
      <span class="state-icon">🗺️</span>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const props = defineProps({ markers: Array })

const mapContainer = ref(null)
const error = ref('')

let googleMaps = null
let map = null
let markersLayer = []

const DEFAULT_CENTER = { lat: -6.9175, lng: 107.6191 }

async function initMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY
  if (!apiKey) {
    error.value = 'Kunci VITE_GOOGLE_MAPS_KEY belum dikonfigurasi di frontend/.env. Peta tidak dapat dimuat.'
    return
  }
  try {
    const loader = new Loader({ apiKey, version: 'weekly' })
    googleMaps = await loader.load()
    const { Map } = await loader.importLibrary('maps')
    map = new Map(mapContainer.value, {
      center: DEFAULT_CENTER,
      zoom: 11,
      mapId: undefined,
    })
    updateMarkers()
  } catch (e) {
    console.error('Gagal memuat Google Maps:', e)
    error.value = 'Gagal memuat Google Maps. Pastikan Maps JavaScript API aktif dan billing diaktifkan di Google Cloud Console.'
  }
}

function popupHtml(m) {
  const rating = m.rating
    ? `<span style="color:#f59e0b;font-weight:700;">★ ${Number(m.rating).toFixed(1)}</span>`
    : '<span style="color:#94a3b8;">Belum ada rating</span>'
  const link = m.google_maps_url
    ? `<a href="${m.google_maps_url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;color:#4285f4;font-weight:600;text-decoration:none;">Buka di Google Maps ↗</a>`
    : ''
  return `
    <div style="font-family:'Segoe UI',Roboto,sans-serif;min-width:170px;">
      <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:4px;">${m.name || ''}</div>
      ${rating}
      <div style="font-size:11px;color:#64748b;margin-top:2px;">${m.address || ''}</div>
      ${link}
    </div>`
}

function updateMarkers() {
  if (!map || !googleMaps) return
  markersLayer.forEach(m => m.setMap(null))
  markersLayer = []

  const valid = props.markers.filter(m => m.latitude && m.longitude)
  if (valid.length === 0) return

  valid.forEach(m => {
    const marker = new googleMaps.maps.Marker({
      position: { lat: m.latitude, lng: m.longitude },
      map,
      title: m.name,
    })
    const info = new googleMaps.maps.InfoWindow({ content: popupHtml(m) })
    marker.addListener('click', () => info.open({ map, anchor: marker }))
    markersLayer.push(marker)
  })

  const bounds = new googleMaps.maps.LatLngBounds()
  valid.forEach(m => bounds.extend({ lat: m.latitude, lng: m.longitude }))
  map.fitBounds(bounds)
}

onMounted(initMap)

watch(() => props.markers, () => updateMarkers(), { deep: true })

onBeforeUnmount(() => {
  markersLayer.forEach(m => m.setMap(null))
  markersLayer = []
  map = null
})
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
}

.map {
  width: 100%;
  height: 100%;
  min-height: 420px;
  border-radius: var(--radius);
}

.map-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f8fafc;
  border-radius: var(--radius);
  text-align: center;
  padding: 24px;
}

.map-error .state-icon {
  font-size: 32px;
}

.map-error p {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 340px;
  line-height: 1.6;
}
</style>
