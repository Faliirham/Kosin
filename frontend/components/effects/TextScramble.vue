<template>
  <span ref="root" class="scramble-text">{{ display }}</span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
})

const CHAR_SET = '!<>-_\\/[]{}—=+*^?#________'

const display = ref(props.text)
const root = ref(null)

let rafId = 0
let frame = 0
let started = false

function scramble() {
  const target = props.text
  const progress = Math.min(frame / Math.max(target.length * 2.2, 34), 1)
  let out = ''
  for (let i = 0; i < target.length; i++) {
    if (target[i] === ' ') {
      out += ' '
    } else if (progress === 1 || i < Math.floor(progress * target.length)) {
      out += target[i]
    } else {
      out += CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
    }
  }
  display.value = out
  if (progress < 1) {
    frame += 1
    rafId = requestAnimationFrame(scramble)
  }
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true
        observer.disconnect()
        rafId = requestAnimationFrame(scramble)
      }
    },
    { threshold: 0.6 }
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>