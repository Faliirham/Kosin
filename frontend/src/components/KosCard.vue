<template>
  <div class="kos-card">
    <div class="card-body">
      <h3>{{ kos.name }}</h3>
      <p class="address">{{ kos.address || 'Alamat tidak tersedia' }}</p>
      <div class="meta">
        <span v-if="kos.rating" class="rating">{{ kos.rating }} ⭐</span>
        <span v-if="kos.price_range" class="price">{{ kos.price_range }}</span>
        <span v-if="kos.city" class="city">{{ kos.city }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ kos: Object })
</script>

<style scoped>
.kos-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  border: 1px solid #eee;
}
.kos-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card-body h3 {
  font-size: 16px;
  margin-bottom: 4px;
}
.address {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}
.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
}
.rating {
  color: #f39c12;
}
.price {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 8px;
  border-radius: 4px;
}
.city {
  background: #e3f2fd;
  color: #1565c0;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
