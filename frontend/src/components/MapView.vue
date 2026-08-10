<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'

const props = defineProps({ markers: Array })

const mapContainer = ref(null)
let map = null
let markersLayer = null

const DEFAULT_VIEW = [-6.9175, 107.6191]

function markerIcon(source) {
  const color = source === 'gmaps' ? '#4285f4' : '#4caf50'
  return L.divIcon({
    className: 'kos-marker',
    html: `<div style="
      width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: ${color};
      border: 2.5px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    "><span style="transform: rotate(45deg); font-size: 14px;">🏠</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  })
}

function popupHtml(m) {
  const rating = m.rating
    ? `<span style="color:#f59e0b;font-weight:700;">★ ${m.rating.toFixed(1)}</span>`
    : '<span style="color:#94a3b8;">Belum ada rating</span>'
  const link = m.google_maps_url
    ? `<a href="${m.google_maps_url}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;color:#6366f1;font-weight:600;text-decoration:none;">Buka di Google Maps ↗</a>`
    : ''
  return `
    <div style="font-family:'Segoe UI',Roboto,sans-serif;min-width:160px;">
      <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:4px;">${m.name}</div>
      ${rating}
      <div style="font-size:11px;color:#64748b;margin-top:2px;">${m.address || ''}</div>
      ${link}
    </div>`
}

onMounted(() => {
  map = L.map(mapContainer.value, { zoomControl: true }).setView(DEFAULT_VIEW, 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  updateMarkers()
})

watch(() => props.markers, () => updateMarkers(), { deep: true })

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})

function updateMarkers() {
  if (!markersLayer || !map) return
  markersLayer.clearLayers()

  const valid = props.markers.filter(m => m.latitude && m.longitude)
  if (valid.length === 0) return

  valid.forEach(m => {
    const marker = L.marker([m.latitude, m.longitude], {
      icon: markerIcon(m.source),
    })
    marker.bindPopup(popupHtml(m))
    markersLayer.addLayer(marker)
  })

  if (valid.length === 1) {
    map.setView([valid[0].latitude, valid[0].longitude], 14)
  } else {
    map.fitBounds(markersLayer.getBounds().pad(0.12))
  }
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  min-height: 420px;
  border-radius: var(--radius);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}
</style>
