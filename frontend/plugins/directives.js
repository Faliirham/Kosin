const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)')
const hasObserver = typeof IntersectionObserver !== 'undefined'

const magnetic = {
  mounted(el, binding) {
    if (!reduced || reduced.matches) return
    const strength = (binding.value && binding.value.strength) || 0.22

    function onMove(e) {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    }

    function onLeave() {
      el.style.transform = ''
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    el._magnetic = { onMove, onLeave }
  },
  unmounted(el) {
    if (el._magnetic) {
      el.removeEventListener('mousemove', el._magnetic.onMove)
      el.removeEventListener('mouseleave', el._magnetic.onLeave)
      delete el._magnetic
    }
  },
}

const revealObserver = hasObserver
  ? new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            revealObserver.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
  : null

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('magnetic', magnetic)
  nuxtApp.vueApp.directive('reveal', {
    mounted(el) {
      if (!revealObserver) return
      el.classList.add('reveal')
      revealObserver.observe(el)
    },
    unmounted(el) {
      if (revealObserver) revealObserver.unobserve(el)
    },
  })
})