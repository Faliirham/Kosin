<template>
  <div id="app-wrapper">
    <header class="header">
      <div class="header-inner">
        <button class="brand" @click="goDashboard">
          <span class="brand-mark">🏠</span>
          <span class="brand-text">
            <span class="brand-name">Kos Finder</span>
            <span class="brand-tagline">Cari kos-kosan terbaik</span>
          </span>
        </button>
        <div class="header-actions">
          <span class="source-pill" v-if="view === 'dashboard'">
            <span class="dot dot-gmaps"></span> Google Maps
          </span>
        </div>
      </div>
    </header>

    <main>
      <Dashboard v-if="view === 'dashboard'" @view-detail="viewDetail" />
      <DetailKos v-else-if="view === 'detail'" :kos-id="selectedId" @back="goDashboard" />
    </main>

    <footer class="footer">
      <p>
        Data © <a href="https://about.google/brand-resource-center/products-and-services/guidelines-google-maps/" target="_blank" rel="noopener">Google Maps</a> contributors
      </p>
      <p class="footer-sub">Dibangun dengan FastAPI &amp; Vue 3</p>
    </footer>

    <TransitionGroup name="toast" tag="div" class="toast-container">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast-${t.type}`">
        <span class="toast-icon">{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ' }}</span>
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Dashboard from './views/Dashboard.vue'
import DetailKos from './views/DetailKos.vue'

const view = ref('dashboard')
const selectedId = ref(null)

function goDashboard() {
  view.value = 'dashboard'
}

function viewDetail(id) {
  selectedId.value = id
  view.value = 'detail'
}

const toasts = ref([])
let toastId = 0

function toast(message, type = 'info', duration = 3200) {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

provide('toast', toast)
</script>

<style>
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #eef2ff;
  --accent: #8b5cf6;
  --bg: #f1f5f9;
  --card: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  --rating: #f59e0b;
  --success: #10b981;
  --danger: #ef4444;
  --google: #4285f4;
  --osm: #4caf50;
  --radius: 14px;
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 16px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 32px rgba(79, 70, 229, 0.14);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

button {
  font-family: inherit;
}

a {
  color: var(--primary);
}

/* ── Header ─────────────────────────── */
.header {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%);
  color: #fff;
  padding: 14px 24px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.25);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 10px;
  transition: background 0.2s;
}

.brand:hover {
  background: rgba(255, 255, 255, 0.08);
}

.brand-mark {
  font-size: 26px;
  line-height: 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.brand-name {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand-tagline {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-gmaps { background: var(--google); }
.dot-osm { background: var(--osm); }
.pill-sep { opacity: 0.4; }

/* ── Layout ──────────────────────────── */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

/* ── Footer ──────────────────────────── */
.footer {
  text-align: center;
  padding: 24px 16px 32px;
  color: var(--text-light);
  font-size: 12px;
  line-height: 1.8;
}

.footer a {
  color: var(--text-muted);
}

.footer-sub {
  font-size: 11px;
  opacity: 0.8;
}

/* ── Toast ───────────────────────────── */
.toast-container {
  position: fixed;
  top: 72px;
  right: 16px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  min-width: 240px;
  max-width: 360px;
}

.toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex: 0 0 auto;
}

.toast-success .toast-icon { background: var(--success); }
.toast-error .toast-icon { background: var(--danger); }
.toast-info .toast-icon { background: var(--primary); }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (max-width: 640px) {
  .toast-container {
    left: 16px;
    right: 16px;
  }

  .toast {
    min-width: 0;
  }
}
</style>
