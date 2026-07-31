<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'

const props = defineProps({ markers: Array })

const mapContainer = ref(null)
let map = null
let markersLayer = null

onMounted(() => {
  map = L.map(mapContainer.value).setView([-6.9175, 107.6191], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  updateMarkers()
})

watch(() => props.markers, () => updateMarkers(), { deep: true })

function updateMarkers() {
  if (!markersLayer) return
  markersLayer.clearLayers()

  const valid = props.markers.filter(m => m.latitude && m.longitude)
  if (valid.length === 0) return

  valid.forEach(m => {
    const marker = L.marker([m.latitude, m.longitude])
    marker.bindPopup(`<b>${m.name}</b><br/>${m.address || ''}`)
    markersLayer.addLayer(marker)
  })

  map.fitBounds(markersLayer.getBounds().pad(0.1))
}
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
