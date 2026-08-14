<template>
  <div class="map-wrap">
    <div ref="mapContainer" class="map"></div>
    <div v-if="error" class="map-state map-error">
      <span class="state-mark">
        <AppIcon name="map-pin" :size="26" />
      </span>
      <strong>Peta belum aktif</strong>
      <p>{{ error }}</p>
    </div>
    <div v-else-if="mapReady && markerCount === 0" class="map-state map-empty">
      <span class="state-mark">
        <AppIcon name="map-pin" :size="24" />
      </span>
      <p>Tidak ada titik lokasi untuk daftar ini. Cari kota lain untuk melihat posisi kos di peta.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import AppIcon from './AppIcon.vue'

const props = defineProps({ markers: Array })

const mapContainer = ref(null)
const error = ref('')
const mapReady = ref(false)
const markerCount = ref(0)

let googleMaps = null
let map = null
let markersLayer = []
let themeObserver = null

const DEFAULT_CENTER = { lat: -6.9175, lng: 107.6191 }

function mapBgColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--map-bg')
    .trim() || '#e8eef7'
}

const PIN_SVG =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
      <path d="M18 1C9 1 2 8.2 2 17.2 2 29 18 45 18 45s16-16 16-27.8C34 8.2 27 1 18 1z" fill="#2563eb" stroke="#fff" stroke-width="2.4"/>
      <path d="M18 10l6.5 9.5H20V28h-4v-8.5h-4.5z" fill="#fff"/>
    </svg>`
  )

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
      backgroundColor: mapBgColor(),
    })
    mapReady.value = true
    themeObserver = new MutationObserver(() => {
      if (map) map.setOptions({ backgroundColor: mapBgColor() })
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    updateMarkers()
  } catch (e) {
    console.error('Gagal memuat Google Maps:', e)
    error.value = 'Gagal memuat Google Maps. Pastikan Maps JavaScript API aktif dan billing diaktifkan di Google Cloud Console.'
  }
}

function popupHtml(m) {
  const rating = m.rating
    ? `<span class="kp-rating">★ ${Number(m.rating).toFixed(1)}</span>`
    : '<span class="kp-na">Belum ada rating</span>'
  const link = m.google_maps_url
    ? `<a href="${m.google_maps_url}" target="_blank" rel="noopener" class="kp-link">Buka di Google Maps ↗</a>`
    : ''
  return `
    <div class="kp-wrap">
      <div class="kp-name">${m.name || ''}</div>
      <div class="kp-meta">${rating}</div>
      <div class="kp-addr">${m.address || ''}</div>
      ${link}
    </div>
    <style>
      .kp-wrap { font-family: var(--font-body); min-width: 180px; }
      .kp-name { font-weight: 700; font-size: 13.5px; color: var(--ink); margin-bottom: 4px; line-height: 1.35; }
      .kp-meta { margin-bottom: 3px; }
      .kp-rating { color: var(--accent); font-weight: 700; font-size: 12.5px; }
      .kp-na { color: var(--muted); font-size: 12px; }
      .kp-addr { font-size: 11.5px; color: var(--muted); line-height: 1.5; margin-bottom: 6px; }
      .kp-link { display: inline-block; color: var(--accent); font-weight: 700; font-size: 12px; text-decoration: none; }
      .kp-link:hover { text-decoration: underline; }
    </style>`
}

function updateMarkers() {
  if (!map || !googleMaps) return
  markersLayer.forEach(m => m.setMap(null))
  markersLayer = []

  const valid = props.markers.filter(m => m.latitude && m.longitude)
  markerCount.value = valid.length
  if (valid.length === 0) return

  const icon = {
    url: PIN_SVG,
    scaledSize: new googleMaps.maps.Size(36, 46),
    anchor: new googleMaps.maps.Point(18, 44),
  }

  valid.forEach(m => {
    const marker = new googleMaps.maps.Marker({
      position: { lat: m.latitude, lng: m.longitude },
      map,
      title: m.name,
      icon,
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
  if (themeObserver) themeObserver.disconnect()
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
  border-radius: inherit;
}

.map-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: inherit;
  text-align: center;
  padding: 24px;
}

.map-error {
  background: var(--surface-2);
}

.map-error strong {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-soft);
}

.map-empty {
  background: var(--overlay);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  pointer-events: none;
}

.map-state p {
  font-size: 13px;
  color: var(--muted);
  max-width: 340px;
  line-height: 1.6;
}

.state-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--accent-soft);
  color: var(--accent);
}
</style>
