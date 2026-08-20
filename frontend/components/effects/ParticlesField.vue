<template>
  <canvas ref="canvas" class="particles-field" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  count: { type: Number, default: 45 },
  color: { type: String, default: '96, 165, 250' },
  linkDistance: { type: Number, default: 130 },
  maxSpeed: { type: Number, default: 0.35 },
})

const canvas = ref(null)

let ctx = null
let width = 0
let height = 0
let dpr = 1
let particles = []
let rafId = 0
let running = false
let reduced = false

function setup() {
  const el = canvas.value
  if (!el) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = el.clientWidth
  height = el.clientHeight
  el.width = width * dpr
  el.height = height * dpr
  ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const target = Math.max(8, Math.round(props.count * Math.min(width / 1400, 1)))
  particles = Array.from({ length: target }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * props.maxSpeed * 2,
    vy: (Math.random() - 0.5) * props.maxSpeed * 2,
    r: Math.random() * 1.6 + 0.8,
  }))

  if (reduced) {
    drawFrame(0)
    return
  }
  if (running) cancelAnimationFrame(rafId)
  running = true
  rafId = requestAnimationFrame(drawFrame)
}

function drawFrame(t) {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < -10) p.x = width + 10
    if (p.x > width + 10) p.x = -10
    if (p.y < -10) p.y = height + 10
    if (p.y > height + 10) p.y = -10
  }

  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    ctx.beginPath()
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${props.color}, 0.7)`
    ctx.fill()

    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.hypot(dx, dy)
      if (dist < props.linkDistance) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(${props.color}, ${(1 - dist / props.linkDistance) * 0.28})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }

  rafId = requestAnimationFrame(drawFrame)
}

function onResize() {
  setup()
}

function onVisibility() {
  if (document.hidden) {
    if (running) cancelAnimationFrame(rafId)
    running = false
  } else if (!reduced && !running) {
    running = true
    rafId = requestAnimationFrame(drawFrame)
  }
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setup()
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.particles-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>