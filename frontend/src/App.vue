<template>
  <a href="#main-content" class="skip-link">Lompat ke konten utama</a>
  <div class="grain" aria-hidden="true"></div>

  <header class="site-header">
    <div class="header-inner">
      <button class="brand" @click="navigate('landing')">
        <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" fill="#C8531B" />
          <path d="M9 15.5 16 9.5l7 6V24a1.5 1.5 0 0 1-1.5 1.5h-3.5V19h-4v6.5H10.5A1.5 1.5 0 0 1 9 24z" fill="#fff" />
        </svg>
        <span class="brand-text">
          <span class="brand-name">Kos Finder</span>
          <span class="brand-sub">temukan rumahmu</span>
        </span>
      </button>

      <nav class="site-nav" aria-label="Navigasi utama">
        <button
          class="nav-link"
          :class="{ active: route.view === 'landing' }"
          @click="navigate('landing')"
        >Beranda</button>
        <button
          class="nav-link"
          :class="{ active: route.view === 'dashboard' }"
          @click="navigate('dashboard')"
        >Jelajahi</button>
      </nav>

      <div class="header-actions">
        <span class="source-pill">
          <span class="dot dot-gmaps"></span>
          Google Maps
          <span class="pill-sep">·</span>
          OSM
        </span>
        <button class="btn-cta" @click="navigate('dashboard')">
          <AppIcon name="search" :size="16" />
          <span>Cari kos</span>
        </button>
      </div>
    </div>
  </header>

  <main id="main-content">
    <Transition name="page" mode="out-in">
      <Landing
        v-if="route.view === 'landing'"
        :key="'landing'"
        @go-dashboard="navigate('dashboard', { city: $event })"
      />
      <Dashboard
        v-else-if="route.view === 'dashboard'"
        :key="'dashboard'"
        :prefill-city="route.city"
      />
      <DetailKos
        v-else-if="route.view === 'detail'"
        :key="route.id"
        :kos-id="route.id"
      />
      <Legal
        v-else-if="route.view === 'legal'"
        :key="route.page"
        :page="route.page"
      />
    </Transition>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#C8531B" />
            <path d="M9 15.5 16 9.5l7 6V24a1.5 1.5 0 0 1-1.5 1.5h-3.5V19h-4v6.5H10.5A1.5 1.5 0 0 1 9 24z" fill="#fff" />
          </svg>
          <span>Kos Finder</span>
        </div>
        <p class="footer-tag">Temukan kos yang terasa seperti rumah — data langsung dari Google Maps dan OpenStreetMap.</p>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Navigasi</h4>
        <button class="footer-link" @click="navigate('landing')">Beranda</button>
        <button class="footer-link" @click="navigate('dashboard')">Jelajahi</button>
      </div>

      <div class="footer-col">
        <h4 class="footer-heading">Legal</h4>
        <button class="footer-link" @click="navigate('legal', { page: 'privacy' })">Kebijakan privasi</button>
        <button class="footer-link" @click="navigate('legal', { page: 'terms' })">Syarat &amp; ketentuan</button>
      </div>

      <div class="footer-col footer-col-attrib">
        <h4 class="footer-heading">Sumber data</h4>
        <a class="footer-link ext" href="https://developers.google.com/maps/documentation" target="_blank" rel="noopener">Google Maps</a>
        <a class="footer-link ext" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ year }} Kos Finder · Dibangun dengan FastAPI &amp; Vue 3</p>
      <p>Data © Google Maps contributors · © OpenStreetMap contributors (ODbL)</p>
    </div>
  </footer>

  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast-${t.type}`">
      <span class="toast-icon">
        <AppIcon :name="t.type === 'success' ? 'check' : t.type === 'error' ? 'alert' : 'info'" :size="13" />
      </span>
      <span class="toast-msg">{{ t.message }}</span>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref, computed, onMounted, provide, watch } from 'vue'
import AppIcon from './components/AppIcon.vue'
import Landing from './views/Landing.vue'
import Dashboard from './views/Dashboard.vue'
import DetailKos from './views/DetailKos.vue'
import Legal from './views/Legal.vue'

function parseHash() {
  const h = location.hash || '#/'
  const [path, qs] = h.slice(1).split('?')
  const params = new URLSearchParams(qs || '')
  const seg = path.split('/').filter(Boolean)
  if (seg[0] === 'kos' && seg[1]) return { view: 'detail', id: seg[1] }
  if (seg[0] === 'dashboard') return { view: 'dashboard', city: params.get('city') || '' }
  if (seg[0] === 'privacy' || seg[0] === 'terms') return { view: 'legal', page: seg[0] }
  return { view: 'landing' }
}

const route = ref(parseHash())

function navigate(view, params = {}) {
  if (view === 'landing') location.hash = '#/'
  else if (view === 'dashboard') {
    const q = params.city ? `?city=${encodeURIComponent(params.city)}` : ''
    location.hash = `#/dashboard${q}`
  } else if (view === 'detail') {
    location.hash = `#/kos/${params.id}`
  } else if (view === 'legal') {
    location.hash = `#/${params.page || 'privacy'}`
  }
}

const titles = {
  landing: 'Kos Finder — Temukan kos yang terasa seperti rumah',
  dashboard: 'Jelajahi — Kos Finder',
  detail: 'Detail kos — Kos Finder',
  legal: 'Kos Finder',
}

watch(route, (r) => {
  document.title = titles[r.view] || 'Kos Finder'
  window.scrollTo({ top: 0, behavior: 'auto' })
})

const year = new Date().getFullYear()

const toasts = ref([])
let toastId = 0

function toast(message, type = 'info', duration = 3200) {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

provide('navigate', navigate)
provide('toast', toast)
provide('route', computed(() => route.value))

onMounted(() => {
  window.addEventListener('hashchange', () => {
    route.value = parseHash()
  })
  document.title = titles[route.value.view] || 'Kos Finder'
})
</script>

<style>
:root {
  --font-display: 'Sora', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-body: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --bg: #f6f2ea;
  --bg-soft: #efe9dc;
  --surface: #ffffff;
  --surface-2: #faf7f0;

  --ink: #221b13;
  --ink-soft: #55493b;
  --muted: #8a7c6b;
  --line: #e4dbc9;
  --line-strong: #d4c8b3;

  --accent: #c8531b;
  --accent-strong: #a63e10;
  --accent-soft: #f6e3d2;

  --dark: #221b13;
  --dark-2: #2c241a;

  --gold: #e0a11b;
  --gold-soft: #f7ebcf;
  --google: #1a73e8;
  --osm: #2f7d4f;
  --danger: #c0392b;
  --danger-soft: #f9e3df;
  --success: #2e8b57;

  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 24px;
  --r-xl: 32px;

  --shadow-sm: 0 1px 2px rgba(34, 27, 19, 0.05), 0 4px 14px rgba(34, 27, 19, 0.05);
  --shadow-md: 0 2px 4px rgba(34, 27, 19, 0.05), 0 14px 30px rgba(34, 27, 19, 0.09);
  --shadow-lg: 0 10px 24px rgba(34, 27, 19, 0.08), 0 28px 56px rgba(34, 27, 19, 0.12);
  --shadow-accent: 0 10px 24px rgba(200, 83, 27, 0.3);
  --focus: 0 0 0 3px rgba(200, 83, 27, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.55;
}

::selection {
  background: var(--accent);
  color: #fff;
}

button {
  font-family: inherit;
  cursor: pointer;
}

a {
  color: var(--accent);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Grain overlay ─────────────────── */
.grain {
  position: fixed;
  inset: 0;
  z-index: 300;
  pointer-events: none;
  opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
}

/* ── Skip link ─────────────────────── */
.skip-link {
  position: fixed;
  top: -60px;
  left: 16px;
  z-index: 500;
  background: var(--dark);
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 12px;
}

/* ── Header ────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(34, 27, 19, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  background: none;
  border: none;
  color: #fff;
  padding: 6px 8px;
  border-radius: var(--r-sm);
  transition: background 0.2s;
}

.brand:hover {
  background: rgba(255, 255, 255, 0.07);
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.02em;
}

.brand-sub {
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
}

.site-nav {
  display: flex;
  gap: 4px;
}

.nav-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: var(--r-sm);
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}

.nav-link.active {
  color: #fff;
  background: rgba(200, 83, 27, 0.9);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 6px 14px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.dot-gmaps { background: var(--google); }
.dot-osm { background: var(--osm); }
.pill-sep { opacity: 0.45; }

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-accent);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn-cta:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.btn-cta:active {
  transform: translateY(0) scale(0.98);
}

/* ── Layout ────────────────────────── */
main {
  min-height: 60vh;
}

/* ── Footer ────────────────────────── */
.site-footer {
  background: var(--dark);
  color: rgba(255, 255, 255, 0.68);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 20px 32px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 36px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 700;
  color: #fff;
  font-size: 16px;
  margin-bottom: 12px;
}

.footer-tag {
  font-size: 13px;
  line-height: 1.7;
  max-width: 300px;
  color: rgba(255, 255, 255, 0.55);
}

.footer-heading {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 14px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.footer-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  padding: 2px 0;
  width: fit-content;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

.footer-link.ext {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 20px 28px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

/* ── Toast ─────────────────────────── */
.toast-container {
  position: fixed;
  top: 82px;
  right: 20px;
  z-index: 400;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--dark-2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-md);
  padding: 13px 18px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  min-width: 250px;
  max-width: 380px;
}

.toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  flex: 0 0 auto;
}

.toast-success .toast-icon { background: var(--success); }
.toast-error .toast-icon { background: var(--danger); }
.toast-info .toast-icon { background: var(--accent); }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(28px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

/* ── Page transition ───────────────── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 860px) {
  .site-nav {
    display: none;
  }
}

@media (max-width: 640px) {
  .source-pill {
    display: none;
  }

  .btn-cta span {
    display: none;
  }

  .btn-cta {
    padding: 10px 12px;
  }

  .footer-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .toast-container {
    left: 16px;
    right: 16px;
  }

  .toast {
    min-width: 0;
  }
}
</style>
