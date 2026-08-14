<template>
  <article
    class="kos-card"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="card-photo">
      <img
        v-if="hasPhoto && !photoFailed"
        :src="kos.photos[0]"
        :alt="`Foto ${kos.name}`"
        loading="lazy"
        @error="photoFailed = true"
      />
      <div v-else class="card-photo-fallback">
        <span class="fallback-mark">
          <AppIcon name="buildings" :size="92" />
        </span>
        <span class="fallback-initial">{{ initial }}</span>
      </div>
      <div class="photo-shade"></div>

      <span class="rating-badge" v-if="kos.rating">
        <AppIcon name="star" filled :size="12" />
        <span class="rating-num">{{ kos.rating.toFixed(1) }}</span>
        <span v-if="kos.total_reviews" class="review-count">({{ kos.total_reviews }})</span>
      </span>

      <span class="source-tag" :class="`source-${kos.source || 'osm'}`">
        <AppIcon name="layers" :size="11" />
        {{ (kos.source || 'osm') === 'gmaps' ? 'Google' : 'OSM' }}
      </span>

      <span class="card-arrow">
        <AppIcon name="arrow-up-right" :size="16" />
      </span>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ kos.name }}</h3>

      <p class="card-address">
        <AppIcon name="map-pin" :size="13" class="pin" />
        <span>{{ kos.address || 'Alamat tidak tersedia' }}</span>
      </p>

      <div class="card-meta">
        <span v-if="kos.price_range" class="chip chip-price">
          <AppIcon name="tag" :size="11" />
          {{ kos.price_range }}
        </span>
        <span v-if="kos.city" class="chip chip-city">{{ kos.city }}</span>
        <span v-if="kos.district" class="chip chip-district">{{ shortDistrict }}</span>
        <span v-if="!kos.rating" class="chip chip-na">Belum ada rating</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { isHttpUrl } from '../services/api.js'

const props = defineProps({ kos: Object })
defineEmits(['click'])

const photoFailed = ref(false)

const hasPhoto = computed(() => isHttpUrl(props.kos.photos?.[0]))

const initial = computed(() => (props.kos.name || '?').trim().charAt(0).toUpperCase())

const shortDistrict = computed(() => {
  const d = props.kos.district || ''
  return d.replace(/^Kec\.\s*/i, '')
})
</script>

<style scoped>
.kos-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.25s, border-color 0.25s;
  display: flex;
  flex-direction: column;
}

.kos-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-border);
}

.kos-card:active {
  transform: translateY(-2px) scale(0.995);
}

.kos-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Photo ────────────────────────── */
.card-photo {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.kos-card:hover .card-photo img {
  transform: scale(1.05);
}

.card-photo-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(80% 120% at 85% 0%, rgba(37, 99, 235, 0.28), transparent 60%),
    radial-gradient(70% 110% at 10% 100%, rgba(96, 165, 250, 0.2), transparent 60%),
    linear-gradient(120deg, #1e293b, #334155);
}

.fallback-mark {
  position: absolute;
  right: -16px;
  bottom: -22px;
  color: rgba(255, 255, 255, 0.1);
}

.fallback-initial {
  position: relative;
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: -0.03em;
}

.photo-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.55), transparent 55%);
  pointer-events: none;
}

.rating-badge {
  position: absolute;
  left: 14px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 800;
  padding: 5px 11px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.review-count {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.source-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 5px 10px;
  border-radius: 8px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.source-gmaps {
  background: rgba(26, 115, 232, 0.85);
  color: #fff;
}

.source-osm {
  background: rgba(47, 125, 79, 0.85);
  color: #fff;
}

.card-arrow {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.22s, transform 0.22s;
}

.kos-card:hover .card-arrow {
  opacity: 1;
  transform: translateY(0);
}

/* ── Body ─────────────────────────── */
.card-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.35;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-address {
  display: flex;
  gap: 6px;
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pin {
  flex: 0 0 auto;
  margin-top: 1px;
  color: var(--accent);
}

.card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 4px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
}

.chip-price {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.chip-city {
  background: var(--bg-soft);
  color: var(--ink-soft);
}

.chip-district {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.chip-na {
  background: var(--bg-soft);
  color: var(--muted);
}
</style>
