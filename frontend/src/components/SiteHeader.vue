<template>
  <header class="site-header">
    <div class="header-inner">
      <button class="brand" @click="$emit('navigate', 'landing')">
        <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="9" fill="#2563EB" />
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
          :class="{ active: activeView === 'landing' }"
          @click="$emit('navigate', 'landing')"
        >Beranda</button>
        <button
          class="nav-link"
          :class="{ active: activeView === 'dashboard' }"
          @click="$emit('navigate', 'dashboard')"
        >Jelajahi</button>
      </nav>

      <div class="header-actions">
        <span class="source-pill">
          <span class="dot dot-gmaps"></span>
          Google Maps
          <span class="pill-sep">·</span>
          OSM
        </span>
        <button class="btn-cta" @click="$emit('navigate', 'dashboard')">
          <AppIcon name="search" :size="16" />
          <span>Cari kos</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({ activeView: { type: String, default: '' } })
defineEmits(['navigate'])
</script>
