<template>
  <a href="#main-content" class="skip-link">Lompat ke konten utama</a>
  <div class="grain" aria-hidden="true"></div>

  <SiteHeader
    :active-view="route.view"
    @navigate="navigate"
  />

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
      <NotFound v-else-if="route.view === 'notfound'" />
    </Transition>
  </main>

  <Transition name="fade" tag="div">
    <button
      v-if="showTop"
      class="back-to-top"
      aria-label="Kembali ke atas halaman"
      title="Kembali ke atas"
      @click="scrollTop"
    >
      <AppIcon name="arrow-up" :size="18" />
    </button>
  </Transition>

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
import { ref, computed, onMounted, onBeforeUnmount, provide, watch } from 'vue'
import AppIcon from './components/AppIcon.vue'
import SiteHeader from './components/SiteHeader.vue'
import Landing from './views/Landing.vue'
import Dashboard from './views/Dashboard.vue'
import DetailKos from './views/DetailKos.vue'
import NotFound from './views/NotFound.vue'

function parseHash() {
  const h = location.hash || '#/'
  const [path, qs] = h.slice(1).split('?')
  const params = new URLSearchParams(qs || '')
  const seg = path.split('/').filter(Boolean)
  if (!seg.length) return { view: 'landing' }
  if (seg[0] === 'kos' && seg[1]) return { view: 'detail', id: seg[1] }
  if (seg[0] === 'dashboard') return { view: 'dashboard', city: params.get('city') || '' }
  return { view: 'notfound' }
}

function focusSearch() {
  const el = document.querySelector(
    'input[aria-label="Nama kota"], input[aria-label="Cari kos"], input[aria-label="Keyword pencarian"]'
  )
  if (el) el.focus()
}

function onGlobalKeydown(e) {
  const tag = e.target && e.target.tagName
  const isTyping =
    tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)
  if (e.key === '/' && !isTyping) {
    e.preventDefault()
    focusSearch()
  }
}

const route = ref(parseHash())

function navigate(view, params = {}) {
  if (view === 'landing') location.hash = '#/'
  else if (view === 'dashboard') {
    const q = params.city ? `?city=${encodeURIComponent(params.city)}` : ''
    location.hash = `#/dashboard${q}`
  } else if (view === 'detail') {
    location.hash = `#/kos/${params.id}`
  }
}

const titles = {
  landing: 'Kos Finder — Temukan kos yang terasa seperti rumah',
  dashboard: 'Jelajahi — Kos Finder',
  detail: 'Detail kos — Kos Finder',
  notfound: 'Halaman tidak ditemukan — Kos Finder',
}

watch(route, (r) => {
  document.title = titles[r.view] || 'Kos Finder'
  window.scrollTo({ top: 0, behavior: 'auto' })
})

const toasts = ref([])
let toastId = 0

function toast(message, type = 'info', duration = 3200) {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

const showTop = ref(false)

function onScroll() {
  showTop.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

provide('navigate', navigate)
provide('toast', toast)
provide('route', computed(() => route.value))

onMounted(() => {
  window.addEventListener('hashchange', () => {
    route.value = parseHash()
  })
  window.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.title = titles[route.value.view] || 'Kos Finder'
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  box-shadow: 0 12px 28px var(--shadow-accent);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease;
}

.back-to-top:hover {
  background: var(--accent-strong);
  transform: translateY(-2px);
}
</style>
