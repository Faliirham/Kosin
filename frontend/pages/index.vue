<template>
  <div class="landing">
    <HeroSection @go-city="goCity" />
    <StatsBand :stats="stats" />
    <FeaturesSection />
    <HowItWorks @go-city="goCity" />
    <CitiesSection @go-city="goCity" />
    <CtaBand @go-city="goCity" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchStats } from '../utils/api.js'
import HeroSection from '../components/landing/HeroSection.vue'
import StatsBand from '../components/landing/StatsBand.vue'
import FeaturesSection from '../components/landing/FeaturesSection.vue'
import HowItWorks from '../components/landing/HowItWorks.vue'
import CitiesSection from '../components/landing/CitiesSection.vue'
import CtaBand from '../components/landing/CtaBand.vue'

const { navigate } = useAppNavigation()

const stats = ref({ total: '1.200+', cities: '30+', rating: '4,6' })

function formatNum(n) {
  return new Intl.NumberFormat('id-ID').format(n)
}

function goCity(c) {
  navigate('dashboard', { city: c.trim() })
}

useHead({
  title: 'Kos Finder — Temukan kos yang terasa seperti rumah',
})

onMounted(async () => {
  try {
    const s = await fetchStats()
    if (s && s.total != null) stats.value.total = formatNum(s.total) + '+'
    if (s && s.cities.length) stats.value.cities = String(s.cities.length) + '+'
    if (s && s.avgRating) stats.value.rating = s.avgRating.toFixed(1).replace('.', ',')
  } catch {
    // backend offline — biarkan nilai placeholder
  }
})
</script>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
}
</style>
