<template>
  <div class="kos-card" @click="$emit('click')">
    <div class="card-top">
      <span class="source-badge source-gmaps">
        <span class="badge-dot"></span>
        Google
      </span>
      <span v-if="kos.rating" class="rating-badge">
        <span class="star">★</span>
        <span class="rating-num">{{ kos.rating.toFixed(1) }}</span>
        <span v-if="kos.total_reviews" class="review-count">({{ kos.total_reviews }})</span>
      </span>
    </div>

    <h3 class="card-title">{{ kos.name }}</h3>

    <p class="card-address">
      <span class="pin">📍</span>
      <span>{{ kos.address || 'Alamat tidak tersedia' }}</span>
    </p>

    <div class="card-meta">
      <span v-if="kos.price_range" class="chip chip-price">{{ kos.price_range }}</span>
      <span v-if="kos.city" class="chip chip-city">{{ kos.city }}</span>
      <span v-if="!kos.rating" class="chip chip-na">Belum ada rating</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ kos: Object })
defineEmits(['click'])
</script>

<style scoped>
.kos-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.2s, border-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kos-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(99, 102, 241, 0.35);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.source-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.source-gmaps {
  background: rgba(66, 133, 244, 0.1);
  color: #1a73e8;
}

.source-osm {
  background: rgba(76, 175, 80, 0.12);
  color: #2e7d32;
}

.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}

.star {
  color: var(--rating);
  font-size: 12px;
}

.review-count {
  font-size: 11px;
  font-weight: 500;
  color: #b45309;
  opacity: 0.8;
}

.card-title {
  font-size: 15.5px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-address {
  display: flex;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pin {
  font-size: 11px;
  flex: 0 0 auto;
}

.card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 4px;
}

.chip {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
}

.chip-price {
  background: #ecfdf5;
  color: #047857;
}

.chip-city {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.chip-na {
  background: #f1f5f9;
  color: var(--text-light);
}
</style>
