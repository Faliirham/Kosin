<template>
  <div class="loading-grid">
    <div v-for="i in count" :key="i" class="skeleton-card">
      <div class="skeleton skeleton-photo"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({ count: { type: Number, default: 6 } })
</script>

<style scoped>
.loading-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  padding-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  border-radius: 8px;
  background: var(--skeleton);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-photo {
  height: 150px;
  border-radius: 0;
}

.skeleton-title {
  width: 70%;
  height: 16px;
  margin: 6px 18px 0;
}

.skeleton-line {
  width: 100%;
  height: 12px;
  margin: 0 18px;
}

.skeleton-line.short {
  width: 55%;
}

@keyframes shimmer {
  to { background-position: -200% 0; }
}

@media (max-width: 900px) {
  .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
