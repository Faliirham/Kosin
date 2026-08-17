<template>
  <section class="stats-band" aria-label="Statistik">
    <div class="stats-inner" v-reveal>
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">kos tercatat</span>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.cities }}</span>
        <span class="stat-label">kota tercakup</span>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.rating }}</span>
        <span class="stat-label">rata-rata rating</span>
      </div>
      <div class="stat-divider" aria-hidden="true"></div>
      <div class="stat-item">
        <span class="stat-value">24 jam</span>
        <span class="stat-label">cache detail Google</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  stats: { type: Object, default: () => ({ total: '1.200+', cities: '30+', rating: '4,6' }) },
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
