<template>
  <section class="hero">
    <div class="hero-bg" aria-hidden="true">
      <img class="hero-photo" :src="heroImg" alt="" />
      <div class="hero-tint"></div>
      <ParticlesField :count="45" color="96, 165, 250" :link-distance="130" />
      <div class="aurora">
        <span
          class="aurora-blob"
          style="width: 460px; height: 460px; left: -160px; top: -140px; background: radial-gradient(circle, rgba(96, 165, 250, 0.5), transparent 70%)"
        ></span>
        <span
          class="aurora-blob"
          style="width: 380px; height: 380px; right: 26%; top: -80px; background: radial-gradient(circle, rgba(129, 140, 248, 0.4), transparent 70%)"
        ></span>
        <span
          class="aurora-blob"
          style="width: 340px; height: 340px; right: -60px; bottom: -140px; background: radial-gradient(circle, rgba(37, 99, 235, 0.5), transparent 70%)"
        ></span>
      </div>
    </div>

    <div class="hero-inner">
      <div class="hero-copy">
        <span class="hero-badge">
          <AppIcon name="map-pin" :size="14" />
          <TextScramble text="Data langsung dari Google Maps" />
        </span>

        <h1 class="hero-title">
          Temukan kos yang <em class="shine">terasa seperti rumah</em>
        </h1>

        <p class="hero-sub">
          Telusuri ribuan kos-kosan di seluruh Indonesia — lengkap dengan rating asli,
          foto, dan lokasi presisi. Tidak perlu jalan keliling lagi.
        </p>

        <form class="hero-search" @submit.prevent="submitSearch">
          <AppIcon name="search" class="search-mark" :size="20" />
          <input
            v-model="city"
            type="text"
            placeholder="Masukkan kota — Bandung, Jakarta, Yogyakarta…"
            aria-label="Nama kota"
          />
          <button type="submit">
            Cari kos
            <AppIcon name="arrow-right" :size="17" />
          </button>
        </form>

        <div class="hero-popular">
          <span class="popular-label">Populer:</span>
          <button
            v-for="c in popularCities"
            :key="c"
            class="popular-chip"
            @click="goCity(c)"
          >{{ c }}</button>
        </div>
      </div>

      <div class="hero-visual">
        <TiltCard :max="6" :scale="1.015" class="hero-tilt">
          <div class="hero-card-main">
            <img :src="heroImg" :alt="altHero" />
            <div class="hero-card-shade"></div>
            <div class="hero-card-live">
              <span class="live-dot"></span>
              Live dari Google Maps
            </div>
          </div>
        </TiltCard>

        <div class="float-card float-top">
          <span class="float-icon">
            <AppIcon name="star" filled :size="18" />
          </span>
          <div>
            <strong>4,6</strong>
            <span>rata-rata rating</span>
          </div>
        </div>

        <div class="float-card float-bottom">
          <span class="float-icon">
            <AppIcon name="map-pin" :size="18" />
          </span>
          <div>
            <strong>30+ kota</strong>
            <span>tercakup di Indonesia</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue'
import AppIcon from '../AppIcon.vue'

const emit = defineEmits(['go-city'])
const toast = inject('toast')

const city = ref('')

const popularCities = ['Bandung', 'Jakarta', 'Yogyakarta', 'Surabaya', 'Malang', 'Semarang']

import { roomIllustration } from '../utils/illustrations.js'

const heroImg = roomIllustration
const altHero = 'Ilustrasi kamar kos yang hangat dan nyaman'

function goCity(c) {
  emit('go-city', c.trim())
}

function submitSearch() {
  const value = city.value.trim()
  if (!value) {
    toast('Masukkan nama kota terlebih dahulu', 'info')
    return
  }
  goCity(value)
}
</script>

<style scoped>
.hero {
  position: relative;
  background: var(--dark);
  color: #fff;
  overflow: hidden;
  border-radius: 0 0 44px 44px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-photo {
  position: absolute;
  right: -6%;
  top: -10%;
  width: 52%;
  height: 130%;
  object-fit: cover;
  opacity: 0.5;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.9), transparent 85%);
  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.9), transparent 85%);
}

.hero-tint {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(70% 80% at 78% 20%, rgba(37, 99, 235, 0.24), transparent 60%),
    radial-gradient(55% 65% at 8% 90%, rgba(59, 130, 246, 0.16), transparent 65%),
    linear-gradient(100deg, var(--dark) 30%, rgba(15, 23, 42, 0.82));
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 20px 120px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 56px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 8px 16px;
  margin-bottom: 28px;
}

.hero-badge .icon {
  color: #93c5fd;
}

.hero-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.5rem, 5.4vw, 4.2rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
  max-width: 14ch;
  text-wrap: balance;
}

.hero-title em {
  font-style: italic;
  font-weight: 500;
  font-family: var(--font-display);
}

.hero-sub {
  margin-top: 22px;
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.72);
  max-width: 46ch;
  text-wrap: pretty;
}

.hero-search {
  margin-top: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 8px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.hero-search:focus-within {
  border-color: rgba(96, 165, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
}

.search-mark {
  color: rgba(255, 255, 255, 0.45);
  margin-left: 10px;
  flex: 0 0 auto;
}

.hero-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-family: var(--font-body);
  font-size: 15.5px;
  padding: 10px 6px;
  min-width: 0;
}

.hero-search input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.hero-search button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 12px;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
}

.hero-search button:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.hero-popular {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.popular-label {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
}

.popular-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 13px;
  border-radius: 999px;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.popular-chip:hover {
  background: rgba(37, 99, 235, 0.28);
  border-color: rgba(96, 165, 250, 0.65);
  color: #fff;
}

/* ── Hero visual ───────────────────── */
.hero-visual {
  position: relative;
}

.hero-card-main {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: var(--shadow-lg);
  transform: rotate(1.5deg);
}

.hero-card-main img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  display: block;
}

.hero-card-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.65), transparent 45%);
}

.hero-card-live {
  position: absolute;
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #fff;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 7px 14px;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #58c08b;
  box-shadow: 0 0 0 4px rgba(88, 192, 139, 0.25);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(88, 192, 139, 0.25); }
  50% { box-shadow: 0 0 0 8px rgba(88, 192, 139, 0.08); }
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  color: var(--ink);
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--line);
}

.float-card strong {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.float-card span {
  font-size: 11.5px;
  color: var(--muted);
  font-weight: 500;
}

.float-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent);
}

.float-top {
  top: 26px;
  left: -52px;
  animation: float 5s ease-in-out infinite;
}

.float-bottom {
  bottom: 34px;
  right: -44px;
  animation: float 6s ease-in-out 1s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ── Responsive ────────────────────── */
@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 64px;
  }

  .hero-visual {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
  }

  .float-top { left: -10px; }
  .float-bottom { right: -8px; }
}

@media (max-width: 640px) {
  .hero {
    border-radius: 0 0 28px 28px;
  }

  .hero-inner {
    padding: 48px 20px 90px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-sub {
    font-size: 15px;
  }

  .hero-search {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-search button {
    justify-content: center;
  }

  .hero-card-main img {
    height: 340px;
  }

  .float-card {
    padding: 11px 14px;
    gap: 10px;
  }

  .float-icon {
    width: 34px;
    height: 34px;
  }

  .float-card strong {
    font-size: 16px;
  }

  .float-top {
    top: 14px;
    left: 6px;
  }

  .float-bottom {
    bottom: 18px;
    right: 6px;
  }
}
</style>
