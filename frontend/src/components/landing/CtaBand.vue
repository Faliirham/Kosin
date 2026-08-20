<template>
  <section class="cta-band">
    <div class="cta-inner" v-reveal>
      <div class="aurora" aria-hidden="true">
        <span
          class="aurora-blob"
          style="width: 420px; height: 420px; left: -140px; top: -160px; background: radial-gradient(circle, rgba(37, 99, 235, 0.55), transparent 70%)"
        ></span>
        <span
          class="aurora-blob"
          style="width: 340px; height: 340px; right: -80px; top: -100px; background: radial-gradient(circle, rgba(96, 165, 250, 0.5), transparent 70%)"
        ></span>
        <span
          class="aurora-blob"
          style="width: 300px; height: 300px; left: 38%; bottom: -180px; background: radial-gradient(circle, rgba(129, 140, 248, 0.4), transparent 70%)"
        ></span>
      </div>
      <h2 class="cta-title">Siap pindah? Mulai cari kosmu sekarang.</h2>
      <p class="cta-sub">Gratis, tanpa daftar, dan langsung menampilkan data dari Google Maps.</p>
      <button class="btn-light-lg" v-magnetic @click="$emit('go-city', '')">
        Jelajahi kos
        <AppIcon name="arrow-right" :size="18" />
      </button>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '../AppIcon.vue'

defineEmits(['go-city'])
</script>

<style scoped>
.cta-band {
  max-width: 1200px;
  margin: 40px auto 96px;
  padding: 0 20px;
}

.cta-inner {
  position: relative;
  overflow: hidden;
  background: var(--dark);
  color: #fff;
  border-radius: var(--r-xl);
  padding: 76px 40px;
  text-align: center;
}

.cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 90% at 20% 10%, rgba(37, 99, 235, 0.35), transparent 60%),
    radial-gradient(50% 80% at 85% 90%, rgba(96, 165, 250, 0.22), transparent 60%);
  pointer-events: none;
}

.cta-title {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.6vw, 2.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  text-wrap: balance;
}

.cta-sub {
  position: relative;
  margin: 14px auto 30px;
  font-size: 15.5px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 46ch;
}

.btn-light-lg {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--surface);
  color: var(--ink);
  border: none;
  font-size: 16px;
  font-weight: 700;
  padding: 16px 34px;
  border-radius: 14px;
  transition: transform 0.15s, box-shadow 0.2s;
}

.btn-light-lg:hover {
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.28);
}

@media (max-width: 640px) {
  .cta-inner {
    padding: 52px 24px;
  }
}
</style>
