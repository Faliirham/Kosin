<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    :stroke="filled ? 'none' : 'currentColor'"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    :class="`icon icon-${name}`"
  >
    <g v-html="svgInner"></g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
  filled: { type: Boolean, default: false },
})

const stroke = {
  search: ['<circle cx="11" cy="11" r="7"/>', '<path d="M21 21l-4.3-4.3"/>'],
  'map-pin': ['<path d="M20 10c0 5-8 11-8 11s-8-6-8-11a8 8 0 1 1 16 0z"/>', '<circle cx="12" cy="10" r="3"/>'],
  'arrow-right': ['<path d="M5 12h14"/>', '<path d="M13 6l6 6-6 6"/>'],
  'arrow-left': ['<path d="M19 12H5"/>', '<path d="M11 6l-6 6 6 6"/>'],
  'arrow-up-right': ['<path d="M7 17L17 7"/>', '<path d="M9 7h8v8"/>'],
  'arrow-down': ['<path d="M12 5v14"/>', '<path d="M6 13l6 6 6-6"/>'],
  'arrow-up': ['<path d="M12 19V5"/>', '<path d="M6 11l6-6 6 6"/>'],
  close: ['<path d="M6 6l12 12"/>', '<path d="M18 6L6 18"/>'],
  check: ['<path d="M20 6L9 17l-5-5"/>'],
  alert: ['<path d="M12 4L2.5 20h19L12 4z"/>', '<path d="M12 10v4"/>', '<path d="M12 17.5v.01"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5v.01"/>'],
  phone: ['<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'],
  globe: ['<circle cx="12" cy="12" r="10"/>', '<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>', '<path d="M2 12h20"/>'],
  tag: ['<path d="M20.5 13.5 13.5 20.5a2 2 0 0 1-2.8 0L3 13V3h10l7.5 7.5a2 2 0 0 1 0 2.8z"/>', '<circle cx="7.5" cy="7.5" r="1.2"/>'],
  clock: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 7v5l3 3"/>'],
  buildings: ['<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z"/>', '<path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>', '<path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>', '<path d="M10 6h4"/>', '<path d="M10 10h4"/>', '<path d="M10 14h4"/>', '<path d="M10 18h4"/>'],
  compass: ['<circle cx="12" cy="12" r="10"/>', '<path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>'],
  sparkle: ['<path d="M12 3.5l1.6 4.9 4.9 1.6-4.9 1.6L12 16.5l-1.6-4.9-4.9-1.6 4.9-1.6z"/>', '<path d="M18.5 15l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z"/>'],
  layers: ['<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>', '<path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>', '<path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>'],
  heart: ['<path d="M12 20.3s-7.5-4.6-9.3-9a5 5 0 0 1 9.3-2.6A5 5 0 0 1 21.3 11c-1.8 4.4-9.3 9-9.3 9z"/>'],
  external: ['<path d="M14 4h6v6"/>', '<path d="M20 4l-9 9"/>', '<path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>'],
  trash: ['<path d="M4 7h16"/>', '<path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>', '<path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>', '<path d="M10 11v6"/>', '<path d="M14 11v6"/>'],
  menu: ['<path d="M4 6h16"/>', '<path d="M4 12h16"/>', '<path d="M4 18h16"/>'],
  home: ['<path d="M4 11l8-7 8 7"/>', '<path d="M6 10v10h12V10"/>'],
  star: ['<path d="M12 3.6l2.5 5.1 5.6.8-4 3.9 1 5.5-5.1-2.7-5.1 2.7 1-5.5-4-3.9 5.6-.8z"/>'],
  quote: ['<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>', '<path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>'],
  minus: ['<path d="M5 12h14"/>'],
  plus: ['<path d="M12 5v14"/>', '<path d="M5 12h14"/>'],
  filter: ['<path d="M4 6h16"/>', '<path d="M7 12h10"/>', '<path d="M10 18h4"/>'],
  direction: ['<path d="M12 3l7 13.5L12 14l-7 2.5z"/>', '<path d="M12 3v11"/>'],
  bolt: ['<path d="M13 3L5 13h5l-1 8 8-10h-5z"/>'],
  eye: ['<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/>', '<circle cx="12" cy="12" r="3"/>'],
  sun: ['<circle cx="12" cy="12" r="4"/>', '<path d="M12 2.5v2"/>', '<path d="M12 19.5v2"/>', '<path d="M4.6 4.6l1.4 1.4"/>', '<path d="M18 18l1.4 1.4"/>', '<path d="M2.5 12h2"/>', '<path d="M19.5 12h2"/>', '<path d="M4.6 19.4L6 18"/>', '<path d="M18 6l1.4-1.4"/>'],
  moon: ['<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'],
  bed: ['<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>', '<path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>', '<path d="M12 4v6"/>', '<path d="M2 18h20"/>'],
  navigation: ['<path d="m3 11 19-9-9 19-2-8-8-2z"/>'],
  wallet: ['<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>', '<path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>', '<path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>'],
  calendar: ['<path d="M8 2v4"/>', '<path d="M16 2v4"/>', '<rect width="18" height="18" x="3" y="4" rx="2"/>', '<path d="M3 10h18"/>'],
  map: ['<path d="M14.11 5.55a2 2 0 0 0 1.79 0l3.66-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.79 0l-4.21-2.1a2 2 0 0 0-1.79 0l-3.66 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9l4.55-2.27a2 2 0 0 1 1.79 0z"/>', '<path d="M15 5.76v15"/>', '<path d="M9 3.24v15"/>'],
  grid: ['<rect width="7" height="7" x="3" y="3" rx="1.5"/>', '<rect width="7" height="7" x="14" y="3" rx="1.5"/>', '<rect width="7" height="7" x="14" y="14" rx="1.5"/>', '<rect width="7" height="7" x="3" y="14" rx="1.5"/>'],
}

const filledMap = {
  star: ['M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],
  heart: ['M12 20.3s-7.5-4.6-9.3-9a5 5 0 0 1 9.3-2.6A5 5 0 0 1 21.3 11c-1.8 4.4-9.3 9-9.3 9z'],
}

const svgInner = computed(() => {
  const list = props.filled ? (filledMap[props.name] || []) : (stroke[props.name] || [])
  return list
    .map(d => (Array.isArray(d) ? d : [d]))
    .flat()
    .map(markup => (markup.startsWith('<') ? markup : `<path d="${markup}"/>`))
    .join('')
})
</script>
