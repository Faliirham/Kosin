<template>
  <div class="filter-bar">
    <div class="scrape-section">
      <input v-model="city" placeholder="Kota (contoh: Bandung)" />
      <input v-model="keyword" placeholder="Keyword (contoh: kos kosan)" />
      <button @click="emitScrape" :disabled="loading || !city">
        {{ loading ? 'Scraping...' : 'Scrape' }}
      </button>
    </div>
    <div class="filter-section">
      <input v-model="search" placeholder="Cari nama kos..." @input="emitFilter" />
      <select v-model="sort" @change="emitFilter">
        <option value="created_at">Terbaru</option>
        <option value="rating">Rating</option>
        <option value="name">Nama</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ loading: Boolean })
const emit = defineEmits(['scrape', 'filter'])

const city = ref('')
const keyword = ref('kos kosan')
const search = ref('')
const sort = ref('created_at')

function emitScrape() {
  emit('scrape', { city: city.value, keyword: keyword.value })
}

function emitFilter() {
  emit('filter', {
    search: search.value || undefined,
    sort: sort.value,
  })
}
</script>

<style scoped>
.filter-bar {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.scrape-section, .filter-section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
input, select, button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
input, select {
  flex: 1;
  min-width: 150px;
}
button {
  background: #2c3e50;
  color: #fff;
  border: none;
  cursor: pointer;
  flex: 0 0 auto;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
