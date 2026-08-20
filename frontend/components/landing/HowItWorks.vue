<template>
  <section class="section section-alt" id="cara-kerja">
    <div class="section-head">
      <span class="eyebrow">Cara kerja</span>
      <h2 class="section-title"><SplitText text="Tiga langkah sederhana" /></h2>
    </div>

    <div class="steps">
      <article class="step spotlight" v-reveal @mousemove="onMove">
        <span class="step-num">01</span>
        <div class="step-body">
          <h3>Masukkan kota</h3>
          <p>Tulis kota atau kecamatan tujuanmu. Kosongkan jika ingin melihat semua.</p>
        </div>
      </article>
      <div class="step-connector" aria-hidden="true">
        <span class="connector-line"></span>
        <AppIcon name="arrow-right" :size="18" />
        <span class="connector-line"></span>
      </div>
      <article class="step spotlight" v-reveal @mousemove="onMove">
        <span class="step-num">02</span>
        <div class="step-body">
          <h3>Kami cari dari Google Maps</h3>
          <p>Scraper menarik data kos terdekat — nama, alamat, rating, hingga rentang harga.</p>
        </div>
      </article>
      <div class="step-connector" aria-hidden="true">
        <span class="connector-line"></span>
        <AppIcon name="arrow-right" :size="18" />
        <span class="connector-line"></span>
      </div>
      <article class="step spotlight" v-reveal @mousemove="onMove">
        <span class="step-num">03</span>
        <div class="step-body">
          <h3>Bandingkan &amp; pilih</h3>
          <p>Filter rating, urutkan, dan buka detail kos favoritmu dalam hitungan detik.</p>
        </div>
      </article>
    </div>

    <div class="cta-row" v-reveal>
      <button class="btn-primary-lg" v-magnetic @click="$emit('go-city', '')">
        Mulai cari kos
        <AppIcon name="arrow-right" :size="18" />
      </button>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '../AppIcon.vue'

defineEmits(['go-city'])

function onMove(e) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  el.style.setProperty('--my', `${e.clientY - rect.top}px`)
}
</script>

<style scoped>
.steps {
  display: flex;
  align-items: stretch;
  gap: 24px;
}

.step {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 34px 30px;
  transition: transform 0.25s, box-shadow 0.25s;
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.step-num {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 800;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 6px 14px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.step-body h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.step-body p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--muted);
}

.step-connector {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--line-strong);
  flex: 0 0 auto;
}

.connector-line {
  width: 26px;
  height: 1px;
  background: var(--line-strong);
}

.cta-row {
  margin-top: 40px;
  text-align: center;
}

.btn-primary-lg {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 34px;
  border-radius: 14px;
  box-shadow: var(--shadow-accent);
  transition: background 0.2s, transform 0.15s;
}

.btn-primary-lg:hover {
  background: var(--accent-strong);
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.4);
}

@media (max-width: 980px) {
  .steps {
    flex-direction: column;
  }

  .step-connector {
    justify-content: center;
  }

  .connector-line {
    display: none;
  }
}
</style>
