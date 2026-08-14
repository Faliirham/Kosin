<template>
  <div class="detail-main">
    <h2 class="detail-title">{{ kos.name }}</h2>

    <p class="detail-address">
      <AppIcon name="map-pin" :size="16" class="pin" />
      {{ kos.address || 'Alamat tidak tersedia' }}
    </p>

    <div class="info-list">
      <div v-if="kos.phone" class="info-item">
        <span class="info-icon">
          <AppIcon name="phone" :size="17" />
        </span>
        <div>
          <span class="info-label">Telepon</span>
          <a :href="`tel:${kos.phone.replace(/\s/g, '')}`" class="info-value link">{{ kos.phone }}</a>
        </div>
      </div>

      <div v-if="kos.website" class="info-item">
        <span class="info-icon">
          <AppIcon name="globe" :size="17" />
        </span>
        <div>
          <span class="info-label">Website</span>
          <a :href="kos.website" target="_blank" rel="noopener" class="info-value link">
            {{ prettyUrl(kos.website) }}
            <AppIcon name="arrow-up-right" :size="13" />
          </a>
        </div>
      </div>

      <div v-if="kos.price_range" class="info-item">
        <span class="info-icon">
          <AppIcon name="tag" :size="17" />
        </span>
        <div>
          <span class="info-label">Rentang harga</span>
          <span class="info-value">{{ kos.price_range }}</span>
        </div>
      </div>

      <div v-if="kos.opening_hours && kos.opening_hours.length" class="info-item info-item-hours">
        <span class="info-icon">
          <AppIcon name="clock" :size="17" />
        </span>
        <div>
          <span class="info-label">Jam buka</span>
          <ul class="hours-list">
            <li v-for="hour in kos.opening_hours" :key="hour">{{ hour }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="actions">
      <button v-if="kos.google_maps_url" class="btn btn-maps" @click="openMaps">
        <AppIcon name="map-pin" :size="17" />
        Buka di Google Maps
        <AppIcon name="arrow-up-right" :size="15" />
      </button>

      <template v-if="!confirmingDelete">
        <button class="btn btn-delete" @click="confirmingDelete = true">
          <AppIcon name="trash" :size="16" />
          Hapus
        </button>
      </template>
      <template v-else>
        <span class="confirm-pill">
          <span class="confirm-text">Hapus kos ini?</span>
          <button class="btn btn-confirm-yes" @click="doDelete">Ya, hapus</button>
          <button class="btn btn-confirm-no" @click="confirmingDelete = false">Batal</button>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import AppIcon from '../AppIcon.vue'
import { deleteKos } from '../../services/api.js'

const props = defineProps({ kos: { type: Object, required: true } })

const navigate = inject('navigate')
const toast = inject('toast')

const confirmingDelete = ref(false)

function prettyUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function openMaps() {
  window.open(props.kos.google_maps_url, '_blank', 'noopener')
}

async function doDelete() {
  confirmingDelete.value = false
  try {
    await deleteKos(props.kos.id)
    toast('Kos berhasil dihapus', 'success')
    navigate('dashboard')
  } catch (e) {
    toast('Gagal menghapus kos', 'error')
  }
}
</script>

<style scoped>
.detail-main {
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.detail-address {
  display: flex;
  gap: 7px;
  margin-top: 12px;
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
}

.pin {
  flex: 0 0 auto;
  margin-top: 2px;
  color: var(--accent);
}

.info-list {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 13px 16px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
}

.info-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 3px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  word-break: break-word;
}

.info-value.link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}

.info-value.link:hover {
  color: var(--accent-strong);
  text-decoration: underline;
}

.hours-list {
  list-style: none;
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.75;
  columns: 2;
  column-gap: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
}

.btn-maps {
  background: var(--accent);
  color: #fff;
  box-shadow: var(--shadow-accent);
}

.btn-maps:hover {
  background: var(--accent-strong);
  transform: translateY(-1px);
}

.btn-maps:active {
  transform: translateY(0) scale(0.98);
}

.btn-delete {
  background: var(--surface);
  color: var(--danger);
  border: 1px solid var(--danger-soft);
}

.btn-delete:hover {
  background: var(--danger-soft);
  border-color: var(--danger);
}

/* ── Inline confirm ────────────────── */
.confirm-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 6px 8px 6px 16px;
}

.confirm-text {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink-soft);
  white-space: nowrap;
}

.btn-confirm-yes {
  background: var(--danger);
  color: #fff;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
}

.btn-confirm-yes:hover {
  background: var(--danger-strong);
  transform: translateY(-1px);
}

.btn-confirm-no {
  background: transparent;
  color: var(--muted);
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  border: 1px solid var(--line);
}

.btn-confirm-no:hover {
  background: var(--bg-soft);
  color: var(--ink);
}

@media (max-width: 640px) {
  .detail-main {
    padding: 24px 20px;
  }

  .hours-list {
    columns: 1;
  }
}
</style>
