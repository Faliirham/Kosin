// Magnetic button (reactbits.dev — MagneticButton), ported to a Vue directive.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

export const magnetic = {
  mounted(el, binding) {
    if (reduced.matches) return
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