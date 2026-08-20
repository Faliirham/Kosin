<template>
  <div ref="root" class="tilt-card" @mousemove="onMove" @mouseleave="onLeave">
    <slot />
    <div class="tilt-glare" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  max: { type: Number, default: 8 },
  scale: { type: Number, default: 1.02 },
})

const root = ref(null)
let finePointer = false
let reduced = false

onMounted(() => {
  finePointer = window.matchMedia('(pointer: fine)').matches
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function onMove(e) {
  if (!finePointer || reduced || !root.value) return
  const rect = root.value.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  root.value.style.transform = `perspective(900px) rotateX(${(-py * props.max).toFixed(2)}deg) rotateY(${(px * props.max).toFixed(2)}deg) scale(${props.scale})`
  root.value.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
  root.value.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
}

function onLeave() {
  if (root.value) root.value.style.transform = ''
}
</script>

<style scoped>
.tilt-card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.tilt-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    380px circle at var(--gx, 50%) var(--gy, 50%),
    rgba(255, 255, 255, 0.16),
    transparent 55%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.tilt-card:hover .tilt-glare {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .tilt-card {
    transition: none;
  }

  .tilt-glare {
    opacity: 0 !important;
  }
}
</style>