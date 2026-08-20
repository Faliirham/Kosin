<template>
  <a href="#main-content" class="skip-link">Lompat ke konten utama</a>
  <div class="grain" aria-hidden="true"></div>

  <ScrollProgress />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

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
import { onMounted, onBeforeUnmount } from 'vue'

const { toasts, toast } = useToasts()
const { showTop, scrollTop } = useBackToTop()
const { navigate } = useAppNavigation()
const { onGlobalKeydown } = useSearchShortcut()

provide('toast', toast)
provide('navigate', navigate)

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
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

@media (max-width: 640px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 42px;
    height: 42px;
  }
}
</style>