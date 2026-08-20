<template>
  <section ref="sectionRef" class="stats-band" aria-label="Statistik">
    <div class="stats-inner" v-reveal>
      <template v-for="(it, i) in items" :key="it.key">
        <div class="stat-item">
          <span class="stat-value">{{ display(it) }}</span>
          <span class="stat-label">{{ it.label }}</span>
        </div>
        <div v-if="i < items.length - 1" class="stat-divider" aria-hidden="true"></div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  stats: { type: Object, default: () => ({ total: '1.200+', cities: '30+', rating: '4,6' }) },
})

const items = computed(() => [
  { key: 'total', label: 'kos tercatat', raw: props.stats.total },
  { key: 'cities', label: 'kota tercakup', raw: props.stats.cities },
  { key: 'rating', label: 'rata-rata rating', raw: props.stats.rating },
  { key: 'cache', label: 'cache detail Google', raw: '24 jam' },
])

function parseStat(raw) {
  const s = String(raw).trim()
  const m = s.match(/^([\d.,]+)(.*)$/)
  if (!m) return null
  const num = parseFloat(m[1].replace(/\./g, '').replace(',', '.'))
  if (Number.isNaN(num)) return null
  return { num, suffix: m[2], decimals: m[1].includes(',') ? 1 : 0 }
}

const sectionRef = ref(null)
const current = ref({})
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
let started = false
let rafId = 0
let observer = null

function applyTargets(instant) {
  for (const it of items.value) {
    const p = parseStat(it.raw)
    if (p) current.value[it.key] = instant ? p.num : 0
  }
}

function startCountUp() {
  if (started) return
  started = true
  const entries = {}
  for (const it of items.value) {
    const p = parseStat(it.raw)
    if (p) entries[it.key] = p
  }
  if (reducedMotion) {
    applyTargets(true)
    return
  }
  applyTargets(false)
  const dur = 1400
  const t0 = performance.now()
  const step = (now) => {
    const prog = Math.min((now - t0) / dur, 1)
    const eased = 1 - Math.pow(1 - prog, 3)
    for (const key in entries) {
      current.value[key] = entries[key].num * eased
    }
    if (prog < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}

function display(it) {
  if (!started) return it.raw
  const p = parseStat(it.raw)
  if (!p) return it.raw
  const v = current.value[it.key] ?? 0
  const fmt = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: p.decimals,
    maximumFractionDigits: p.decimals,
  })
  return fmt.format(v) + p.suffix
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startCountUp()
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

watch(
  () => props.stats,
  () => {
    if (started) applyTargets(true)
  },
  { deep: true }
)

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.stats-band {
  max-width: 1160px;
  margin: -56px auto 0;
  position: relative;
  z-index: 5;
  padding: 0 20px;
}

.stats-inner {
  position: relative;
  background: linear-gradient(180deg, var(--surface), var(--surface-2));
  border: none;
  border-radius: 22px;
  box-shadow: var(--shadow-md), 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  padding: 34px 28px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  align-items: center;
}

html[data-theme='dark'] .stats-inner {
  box-shadow: var(--shadow-md), 0 1px 0 rgba(255, 255, 255, 0.04) inset;
}

.stat-divider {
  width: 1px;
  height: 42px;
  background: var(--line);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

@media (max-width: 640px) {
  .stats-inner {
    grid-template-columns: 1fr 1fr;
    padding: 26px 20px;
    row-gap: 20px;
  }

  .stat-divider {
    display: none;
  }

  .stat-value {
    font-size: 26px;
  }
}
</style>