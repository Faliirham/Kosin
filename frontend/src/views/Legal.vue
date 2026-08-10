<template>
  <div class="legal">
    <div class="legal-card">
      <button class="back-btn" @click="navigate('landing')">
        <AppIcon name="arrow-left" :size="16" />
        Kembali
      </button>

      <span class="eyebrow">{{ page === 'privacy' ? 'Legal' : 'Legal' }}</span>
      <h1 class="legal-title">{{ page === 'privacy' ? 'Kebijakan privasi' : 'Syarat &amp; ketentuan' }}</h1>
      <p class="legal-date">Terakhir diperbarui: 10 Agustus 2026</p>

      <template v-if="page === 'privacy'">
        <section>
          <h2>Data yang kami kumpulkan</h2>
          <p>
            Kos Finder tidak memerlukan akun dan tidak mengumpulkan data pribadi untuk menggunakan
            layanan. Kami hanya menyimpan data kos-kosan (nama, alamat, koordinat, rating, dan
            metadata publik) yang ditarik dari Google Maps dan OpenStreetMap.
          </p>
        </section>
        <section>
          <h2>Data dari pihak ketiga</h2>
          <p>
            Informasi kos ditampilkan sesuai yang tersedia pada platform sumber. Rating dan ulasan
            milik Google Maps, dan data geografis milik kontributor OpenStreetMap (lisensi ODbL).
            Kami tidak mengklaim kepemilikan atas data tersebut.
          </p>
        </section>
        <section>
          <h2>Cookie &amp; penyimpanan</h2>
          <p>
            Aplikasi ini tidak menggunakan cookie pelacakan. Preferensi tampilan hanya disimpan
            sementara di memori peramban Anda.
          </p>
        </section>
      </template>

      <template v-else>
        <section>
          <h2>Penggunaan layanan</h2>
          <p>
            Kos Finder disediakan sebagai alat pencarian informasi kos-kosan. Kami berusaha menjaga
            data tetap akurat, tetapi tidak menjamin kelengkapan atau kebenarannya setiap saat.
          </p>
        </section>
        <section>
          <h2>Sumber data</h2>
          <p>
            Data ditampilkan langsung dari Google Maps dan OpenStreetMap. Bila Anda adalah pemilik
            kos dan menemukan informasi yang keliru, harap perbarui melalui platform sumber data
            tersebut.
          </p>
        </section>
        <section>
          <h2>Batasan tanggung jawab</h2>
          <p>
            Kami tidak bertanggung jawab atas kerugian yang timbul dari keputusan yang diambil
            berdasarkan informasi di situs ini. Verifikasi langsung ke lokasi tetap disarankan
            sebelum bertransaksi.
          </p>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import AppIcon from '../components/AppIcon.vue'

defineProps({ page: String })

const navigate = inject('navigate')
</script>

<style scoped>
.legal {
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

.legal-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-md);
  padding: 40px 48px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: 12px;
  margin-bottom: 28px;
  transition: background 0.2s, transform 0.15s;
}

.back-btn:hover {
  background: var(--accent-soft);
  transform: translateX(-2px);
}

.eyebrow {
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.legal-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 8px 0 6px;
}

.legal-date {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 28px;
}

section {
  margin-bottom: 26px;
}

section h2 {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

section p {
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink-soft);
  max-width: 62ch;
}

@media (max-width: 640px) {
  .legal-card {
    padding: 28px 24px;
  }
}
</style>
