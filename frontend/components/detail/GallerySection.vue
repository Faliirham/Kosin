<template>
  <div class="gallery">
    <div class="gallery-main">
      <img
        v-if="activePhoto && !photoFailed"
        :src="activePhoto"
        :alt="`Foto ${name}`"
        @error="photoFailed = true"
      />
      <div v-else class="gallery-fallback">
        <AppIcon name="buildings" :size="44" />
        <span class="fallback-title">Foto belum tersedia</span>
        <span class="fallback-sub">Foto diambil langsung dari Google saat kuota aktif</span>
      </div>
      <div v-if="rating" class="gallery-rating">
        <AppIcon name="star" filled :size="14" />
        <strong>{{ rating.toFixed(1) }}</strong>
        <span v-if="totalReviews">· {{ totalReviews }} ulasan</span>
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
        <img :src="p" :alt="`Foto ${name} ${i + 1}`" loading="lazy" @error="onThumbError" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AppIcon from '../AppIcon.vue'
import { isHttpUrl } from '../../utils/api.js'

const props = defineProps({
  photos: { type: Array, default: () => [] },
  name: { type: String, default: '' },
  rating: { type: Number, default: null },
  totalReviews: { type: Number, default: null },
})

const activePhoto = ref('')
const photoFailed = ref(false)

const photoThumbs = computed(() => props.photos.filter(isHttpUrl).slice(0, 5))

watch(photoThumbs, (p) => {
  if (!activePhoto.value || !p.includes(activePhoto.value)) {
    activePhoto.value = p[0] || ''
  }
})

function onThumbError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
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
  gap: 8px;
  color: rgba(255, 255, 255, 0.42);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  padding: 24px;
  background:
    radial-gradient(80% 120% at 85% 0%, rgba(37, 99, 235, 0.3), transparent 60%),
    radial-gradient(70% 110% at 10% 100%, rgba(96, 165, 250, 0.22), transparent 60%),
    linear-gradient(120deg, #1e293b, #334155);
}

.fallback-title {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 700;
}

.fallback-sub {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  max-width: 240px;
}

.gallery-rating {
  position: absolute;
  left: 18px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #bfdbfe;
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

@media (max-width: 860px) {
  .gallery-main {
    min-height: 300px;
  }
}
</style>
