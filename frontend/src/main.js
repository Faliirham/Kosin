import { createApp } from 'vue'
import './styles/tokens.css'
import './styles/base.css'
import './styles/effects.css'
import './styles/header.css'
import './styles/toast.css'
import './styles/transitions.css'
import './styles/sections.css'
import App from './App.vue'
import { initTheme } from './services/theme.js'
import { magnetic } from './directives/magnetic.js'

initTheme()

const app = createApp(App)

const revealObserver = new IntersectionObserver(
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

app.directive('reveal', {
  mounted(el) {
    el.classList.add('reveal')
    revealObserver.observe(el)
  },
  unmounted(el) {
    revealObserver.unobserve(el)
  },
})

app.directive('magnetic', magnetic)

app.mount('#app')
