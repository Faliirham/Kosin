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
          <span class="brand-sub">Temukan kos impianmu</span>
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
        <button
          class="theme-toggle"
          :aria-label="isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'"
          :title="isDark ? 'Mode terang' : 'Mode gelap'"
          @click="onToggleTheme"
        >
          <AppIcon :name="isDark ? 'sun' : 'moon'" :size="18" />
        </button>
        <button class="btn-cta" @click="$emit('navigate', 'dashboard')">
          <AppIcon name="search" :size="16" />
          <span>Cari kos</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
import { resolveTheme, toggleTheme, onThemeChange } from '../services/theme.js'

defineProps({ activeView: { type: String, default: '' } })
defineEmits(['navigate'])

const isDark = ref(resolveTheme() === 'dark')

let unsubscribe = null

function onToggleTheme() {
  isDark.value = toggleTheme() === 'dark'
}

onMounted(() => {
  unsubscribe = onThemeChange(theme => {
    isDark.value = theme === 'dark'
  })
})

onBeforeUnmount(() => {
  if (unsubscribe) unsubscribe()
})
</script>
