<template>
  <div class="notfound">
    <span class="code">404</span>
    <h1 class="title">Halaman tidak ditemukan</h1>
    <p class="sub">Alamat yang kamu tuju tidak ada atau sudah dipindahkan.</p>
    <button class="btn-home" @click="navigate('landing')">
      <AppIcon name="arrow-left" :size="16" />
      Kembali ke beranda
    </button>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import AppIcon from '../components/AppIcon.vue'

const navigate = inject('navigate')
</script>

<style scoped>
.notfound {
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 20px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.code {
  font-family: var(--font-display);
  font-size: 96px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--accent-soft);
  background: linear-gradient(100deg, var(--accent) 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-top: 6px;
}

.sub {
  font-size: 15px;
  color: var(--muted);
  max-width: 40ch;
  line-height: 1.7;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 14.5px;
  font-weight: 700;
  padding: 13px 26px;
  border-radius: 12px;
  box-shadow: var(--shadow-accent);
  transition: background 0.2s, transform 0.15s;
}

.btn-home:hover {
  background: var(--accent-strong);
  transform: translateY(-2px);
}
</style>
