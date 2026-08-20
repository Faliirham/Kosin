<template>
  <div class="scroll-progress" aria-hidden="true">
    <div ref="bar" class="scroll-progress-bar"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const bar = ref(null)
let ticking = false

function update() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const pct = max > 0 ? window.scrollY / max : 0
  if (bar.value) bar.value.style.transform = `scaleX(${pct})`
  ticking = false
}

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(update)
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 200;
  pointer-events: none;
}

.scroll-progress-bar {
  height: 100%;
  width: 100%;
  transform-origin: left;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--accent), #93c5fd);
}
</style>