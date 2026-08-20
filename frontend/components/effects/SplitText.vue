<template>
  <span ref="root" class="split-text" :class="{ 'is-visible': visible }" aria-label="text">
    <span
      v-for="(word, i) in words"
      :key="i"
      class="split-word"
      :style="{ transitionDelay: `${delay + i * 55}ms` }"
    >{{ word }}{{ i < words.length - 1 ? ' ' : '' }}</span>
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  delay: { type: Number, default: 0 },
})

const words = computed(() => props.text.split(' '))
const root = ref(null)
const visible = ref(false)

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.4 }
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.split-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.6em);
  transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: pre-wrap;
}

.is-visible .split-word {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .split-word {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>