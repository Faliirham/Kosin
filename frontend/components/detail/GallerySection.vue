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
      <button
        v-if="activePhoto && !photoFailed"
        class="gallery-zoom"
        type="button"
        aria-label="Perbesar foto"
        @click="openLightbox"
      >
        <AppIcon name="expand" :size="16" />
      </button>
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

    <div
      v-if="lightboxOpen"
      ref="lightboxEl"
      class="lightbox"
      tabindex="-1"
      @click.self="closeLightbox"
      @keydown.esc="closeLightbox"
    >
      <button class="lb-close" type="button" aria-label="Tutup" @click="closeLightbox">
        <AppIcon name="close" :size="20" />
      </button>
      <button
        v-if="photoThumbs.length > 1"
        class="lb-nav lb-prev"
        type="button"
        aria-label="Sebelumnya"
        @click.stop="step(-1)"
      >
        <AppIcon name="arrow-left" :size="22" />
      </button>
      <img class="lb-img" :src="lightboxPhoto" :alt="`Foto ${name}`" />
      <button
        v-if="photoThumbs.length > 1"
        class="lb-nav lb-next"
        type="button"
        aria-label="Berikutnya"
        @click.stop="step(1)"
      >
        <AppIcon name="arrow-right" :size="22" />
      </button>
      <div v-if="photoThumbs.length > 1" class="lb-count">
        {{ lightboxIndex + 1 }} / {{ photoThumbs.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
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

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxEl = ref(null)
const lightboxPhoto = computed(() => photoThumbs.value[lightboxIndex.value] || '')

function openLightbox(i) {
  const idx = typeof i === 'number' ? i : photoThumbs.value.indexOf(activePhoto.value)
  lightboxIndex.value = idx < 0 ? 0 : idx
  lightboxOpen.value = true
  nextTick(() => lightboxEl.value?.focus())
}

function closeLightbox() {
  lightboxOpen.value = false
}

function step(dir) {
  const n = photoThumbs.value.length
  if (!n) return
  lightboxIndex.value = (lightboxIndex.value + dir + n) % n
}

function onKey(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === 'ArrowRight') step(1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

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
  cursor: zoom-in;
}

.gallery-zoom {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: background 0.2s, transform 0.15s;
}

.gallery-zoom:hover {
  background: rgba(15, 23, 42, 0.8);
  transform: translateY(-2px);
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

/* ── Lightbox ───────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 40px;
  background: rgba(8, 12, 22, 0.88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: lbFade 0.2s ease;
  outline: none;
}

@keyframes lbFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lb-img {
  max-width: min(90vw, 1100px);
  max-height: 86vh;
  border-radius: 14px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.lb-close,
.lb-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.lb-close {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 44px;
  height: 44px;
}

.lb-nav {
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
}

.lb-close:hover,
.lb-nav:hover {
  background: rgba(37, 99, 235, 0.85);
  transform: scale(1.05);
}

.lb-count {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 6px 14px;
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox { animation: none; }
}

@media (max-width: 640px) {
  .lightbox {
    padding: 16px;
    gap: 8px;
  }

  .lb-nav {
    width: 42px;
    height: 42px;
  }
}
</style>
