import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useAppNavigation() {
  const router = useRouter()

  function navigate(view, params = {}) {
    if (view === 'landing') return router.push('/')
    if (view === 'dashboard') {
      return router.push({
        path: '/dashboard',
        query: params.city ? { city: params.city } : {},
      })
    }
    if (view === 'detail') return router.push(`/kos/${params.id}`)
  }

  return { navigate }
}

export function useActiveView() {
  const route = useRoute()

  return computed(() => {
    if (route.path === '/' || route.path === '') return 'landing'
    if (route.path === '/dashboard') return 'dashboard'
    if (route.path.startsWith('/kos/')) return 'detail'
    return 'notfound'
  })
}

export function useToasts() {
  const toasts = ref([])
  let toastId = 0

  function toast(message, type = 'info', duration = 3200) {
    const id = ++toastId
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return { toasts, toast }
}

export function useBackToTop() {
  const showTop = ref(false)

  function onScroll() {
    showTop.value = window.scrollY > 400
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  return { showTop, scrollTop }
}

export function useSearchShortcut() {
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

  return { onGlobalKeydown }
}