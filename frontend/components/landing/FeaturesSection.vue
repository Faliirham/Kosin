<template>
  <section class="section" id="fitur">
    <div class="section-head" v-reveal>
      <span class="eyebrow">Kenapa Kos Finder</span>
      <h2 class="section-title">Cari kos lebih pintar,<br />bukan lebih capek</h2>
      <p class="section-sub">
        Kami menggabungkan data Google Maps dengan tampilan yang jujur, supaya kamu
        bisa membandingkan kos tanpa harus keliling kota satu per satu.
      </p>
    </div>

    <div class="bento">
      <article class="bento-card bento-photo" v-reveal>
        <img :src="imgRoom1" :alt="altRoom1" />
        <div class="bento-shade"></div>
        <div class="bento-caption">
          <h3>Lihat kondisi kos sebelum datang</h3>
          <p>Foto di-resolve langsung dari Google saat kamu membuka detail kos.</p>
        </div>
      </article>

      <article class="bento-card bento-accent spotlight" v-reveal @mousemove="onMove">
        <span class="bento-icon">
          <AppIcon name="star" filled :size="22" />
        </span>
        <h3>Rating asli</h3>
        <p>Penilaian dan ulasan diambil langsung dari Google Maps — bukan angka rekaan.</p>
      </article>

      <article class="bento-card spotlight" v-reveal @mousemove="onMove">
        <span class="bento-icon">
          <AppIcon name="map-pin" :size="22" />
        </span>
        <h3>Peta presisi</h3>
        <p>Google Maps menampilkan posisi tiap kos secara akurat, dekat dengan kampus atau kantormu.</p>
      </article>

      <article class="bento-card spotlight" v-reveal @mousemove="onMove">
        <span class="bento-icon">
          <AppIcon name="layers" :size="22" />
        </span>
        <h3>Update otomatis</h3>
        <p>Re-scrape menyegarkan data lama secara langsung, tanpa duplikat dan tanpa data basi.</p>
      </article>

      <article class="bento-card bento-photo bento-photo-tall" v-reveal>
        <img :src="imgRoom2" :alt="altRoom2" />
        <div class="bento-shade"></div>
        <div class="bento-caption">
          <h3>Bandingkan dalam satu tampilan</h3>
          <p>Rating, harga, dan lokasi tersaji berdampingan.</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '../AppIcon.vue'

const imgRoom1 = 'https://picsum.photos/seed/kos-room-1/1000/700'
const imgRoom2 = 'https://picsum.photos/seed/kos-room-2/800/1000'
const altRoom1 = 'Kamar kos dengan pencahayaan alami'
const altRoom2 = 'Sudut kamar kos yang rapi dan modern'

function onMove(e) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
}
</script>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 20px;
}

.bento-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}

.bento-card:not(.bento-photo):hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--line-strong);
}

.bento-photo {
  grid-column: span 2;
  justify-content: flex-end;
  padding: 0;
  min-height: 300px;
}

.bento-photo-tall {
  grid-column: span 1;
}

.bento-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bento-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.78), transparent 55%);
}

.bento-caption {
  position: relative;
  color: #fff;
  padding: 26px;
  max-width: 420px;
}

.bento-caption h3 {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.bento-caption p {
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
}

.bento-accent {
  background: linear-gradient(150deg, var(--accent) 0%, var(--accent-strong) 100%);
  border-color: transparent;
  color: #fff;
  justify-content: flex-end;
}

.bento-accent h3,
.bento-accent p {
  position: relative;
}

.bento-accent h3 {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.bento-accent p {
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
}

.bento-card h3 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.bento-card > p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--muted);
}

.bento-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 8px;
}

.bento-accent .bento-icon {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

@media (max-width: 980px) {
  .bento {
    grid-template-columns: 1fr 1fr;
  }

  .bento-photo,
  .bento-photo-tall {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .bento {
    grid-template-columns: 1fr;
  }

  .bento-photo,
  .bento-photo-tall {
    grid-column: span 1;
    min-height: 240px;
  }
}
</style>
