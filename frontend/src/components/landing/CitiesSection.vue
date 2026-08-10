<template>
  <section class="section" id="kota">
    <div class="section-head">
      <span class="eyebrow">Kota populer</span>
      <h2 class="section-title">Mau pindah ke mana?</h2>
      <p class="section-sub">Pilih kota favoritmu untuk langsung melihat kos-kosan di sekitarnya.</p>
    </div>

    <div class="city-grid">
      <button
        v-for="c in cityCards"
        :key="c.name"
        class="city-card"
        @click="$emit('go-city', c.name)"
      >
        <span class="city-icon">
          <AppIcon name="buildings" :size="22" />
        </span>
        <span class="city-text">
          <span class="city-name">{{ c.name }}</span>
          <span class="city-meta">{{ c.meta }}</span>
        </span>
        <AppIcon name="arrow-up-right" class="city-arrow" :size="18" />
      </button>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '../AppIcon.vue'

defineEmits(['go-city'])

const cityCards = [
  { name: 'Bandung', meta: '±3.500 kos · Jawa Barat' },
  { name: 'Jakarta', meta: '±4.800 kos · DKI Jakarta' },
  { name: 'Yogyakarta', meta: '±2.900 kos · DI Yogyakarta' },
  { name: 'Surabaya', meta: '±2.200 kos · Jawa Timur' },
  { name: 'Malang', meta: '±1.800 kos · Jawa Timur' },
  { name: 'Semarang', meta: '±1.400 kos · Jawa Tengah' },
]
</script>

<style scoped>
.city-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.city-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  padding: 22px 52px 22px 24px;
  text-align: left;
  color: var(--ink);
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}

.city-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(37, 99, 235, 0.4);
}

.city-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 13px;
  background: var(--accent-soft);
  color: var(--accent);
}

.city-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.city-name {
  font-family: var(--font-display);
  font-size: 16.5px;
  font-weight: 700;
}

.city-meta {
  display: block;
  font-size: 12.5px;
  color: var(--muted);
}

.city-arrow {
  position: absolute;
  right: 20px;
  color: var(--line-strong);
  transition: color 0.2s, transform 0.2s;
}

.city-card:hover .city-arrow {
  color: var(--accent);
  transform: translate(2px, -2px);
}

@media (max-width: 980px) {
  .city-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .city-grid {
    grid-template-columns: 1fr;
  }
}
</style>
