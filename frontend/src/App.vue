<template>
  <div id="app-wrapper">
    <header class="header">
      <h1 @click="view = 'dashboard'">Kos Finder</h1>
    </header>
    <main>
      <Dashboard v-if="view === 'dashboard'" @view-detail="viewDetail" />
      <DetailKos v-else-if="view === 'detail'" :kos-id="selectedId" @back="view = 'dashboard'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Dashboard from './views/Dashboard.vue'
import DetailKos from './views/DetailKos.vue'

const view = ref('dashboard')
const selectedId = ref(null)

function viewDetail(id) {
  selectedId.value = id
  view.value = 'detail'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
}
.header {
  background: #2c3e50;
  color: #fff;
  padding: 16px 24px;
  cursor: pointer;
}
.header h1 {
  font-size: 20px;
}
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
</style>
