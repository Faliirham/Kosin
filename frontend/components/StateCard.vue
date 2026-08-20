<template>
  <div class="state-card" :class="`state-${type}`">
    <span class="state-mark">
      <AppIcon :name="icon" :size="30" />
    </span>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  type: { type: String, default: 'empty' },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, default: '' },
})
</script>

<style scoped>
.state-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 72px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}

.state-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 8px;
}

.state-card h3 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.state-card p {
  font-size: 14px;
  color: var(--muted);
  max-width: 400px;
  line-height: 1.7;
}

.state-error p {
  color: var(--danger);
}
</style>
