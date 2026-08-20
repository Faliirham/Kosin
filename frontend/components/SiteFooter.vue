<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <button class="footer-logo" @click="$emit('navigate', 'landing')" aria-label="Kos Finder — kembali ke beranda">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#2563EB" />
            <path d="M9 15.5 16 9.5l7 6V24a1.5 1.5 0 0 1-1.5 1.5h-3.5V19h-4v6.5H10.5A1.5 1.5 0 0 1 9 24z" fill="#fff" />
          </svg>
          <span class="footer-brand-name">Kos Finder</span>
        </button>
        <p class="footer-tagline">Temukan kos yang terasa seperti rumah — data langsung dari Google Maps, gratis tanpa daftar.</p>
      </div>

      <nav class="footer-nav" aria-label="Navigasi footer">
        <span class="footer-label">Jelajahi</span>
        <button @click="$emit('navigate', 'landing')">Beranda</button>
        <button @click="$emit('navigate', 'dashboard')">Jelajahi kos</button>
      </nav>

      <div class="footer-legal">
        <span class="footer-label">Legal</span>
        <a href="#" rel="noopener" @click.prevent="comingSoon('Kebijakan Privasi')">Kebijakan Privasi</a>
        <a href="#" rel="noopener" @click.prevent="comingSoon('Syarat &amp; Ketentuan')">Syarat &amp; Ketentuan</a>
      </div>

      <div class="footer-attribution">
        <span class="footer-label">Sumber data</span>
        <p class="footer-note">
          Data kos diambil dari
          <a href="https://developers.google.com/maps/terms" target="_blank" rel="noopener">Google Maps</a>
          (© Google) dan geocode fallback dari
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>
          (© kontributor, lisensi ODbL).
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">
        © {{ year }} Kos Finder — Dibuat dengan FastAPI &amp; Vue 3
      </p>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue'

defineEmits(['navigate'])

const toast = inject('toast')

const year = new Date().getFullYear()

function comingSoon(label) {
  toast(`${label} — halaman sedang disiapkan`, 'info')
}
</script>

<style scoped>
.site-footer {
  margin-top: 48px;
  background: var(--dark);
  color: rgba(255, 255, 255, 0.72);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 20px 40px;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
  gap: 40px;
}

.footer-brand,
.footer-nav,
.footer-legal,
.footer-attribution {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 0;
  color: #fff;
}

.footer-brand-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.footer-tagline {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  max-width: 34ch;
}

.footer-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.4);
}

.footer-nav button,
.footer-legal a {
  background: none;
  border: none;
  padding: 0;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.footer-nav button:hover,
.footer-legal a:hover {
  color: #fff;
}

.footer-attribution .footer-note {
  font-size: 12.5px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  max-width: 40ch;
}

.footer-attribution a {
  color: #93c5fd;
  text-decoration: none;
}

.footer-attribution a:hover {
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-copy {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 520px) {
  .footer-inner {
    grid-template-columns: 1fr;
    padding: 44px 20px 32px;
  }
}
</style>
