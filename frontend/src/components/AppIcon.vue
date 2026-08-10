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
    <template v-for="(d, i) in paths" :key="i">
      <path v-if="typeof d === 'string'" :d="d" />
      <g v-else>
        <path v-for="(p, j) in d" :key="j" :d="p" />
      </g>
    </template>
  </svg>
</template>

<script setup>
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
  close: ['<path d="M6 6l12 12"/>', '<path d="M18 6L6 18"/>'],
  check: ['<path d="M20 6L9 17l-5-5"/>'],
  alert: ['<path d="M12 4L2.5 20h19L12 4z"/>', '<path d="M12 10v4"/>', '<path d="M12 17.5v.01"/>'],
  info: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 11v5"/>', '<path d="M12 7.5v.01"/>'],
  phone: ['<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'],
  globe: ['<circle cx="12" cy="12" r="9"/>', '<path d="M3 12h18"/>', '<path d="M12 3a15 15 0 0 1 0 18"/>', '<path d="M12 3a15 15 0 0 0 0 18"/>'],
  tag: ['<path d="M20.5 13.5 13.5 20.5a2 2 0 0 1-2.8 0L3 13V3h10l7.5 7.5a2 2 0 0 1 0 2.8z"/>', '<circle cx="7.5" cy="7.5" r="1.2"/>'],
  clock: ['<circle cx="12" cy="12" r="9"/>', '<path d="M12 7v5l3 3"/>'],
  buildings: ['<path d="M4 21V8l7-3v16"/>', '<path d="M4 21h16"/>', '<path d="M11 21V10.5L20 8v13"/>', '<path d="M8 10v.01"/>', '<path d="M8 13v.01"/>', '<path d="M8 16v.01"/>', '<path d="M17 12v.01"/>', '<path d="M17 15v.01"/>'],
  compass: ['<circle cx="12" cy="12" r="9"/>', '<path d="M15.5 8.5l-2 5-5 2 2-5z"/>'],
  sparkle: ['<path d="M12 3.5l1.6 4.9 4.9 1.6-4.9 1.6L12 16.5l-1.6-4.9-4.9-1.6 4.9-1.6z"/>', '<path d="M18.5 15l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z"/>'],
  layers: ['<path d="M12 3l9 5-9 5-9-5z"/>', '<path d="M3 13l9 5 9-5"/>'],
  heart: ['<path d="M12 20.3s-7.5-4.6-9.3-9a5 5 0 0 1 9.3-2.6A5 5 0 0 1 21.3 11c-1.8 4.4-9.3 9-9.3 9z"/>'],
  external: ['<path d="M14 4h6v6"/>', '<path d="M20 4l-9 9"/>', '<path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>'],
  trash: ['<path d="M4 7h16"/>', '<path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>', '<path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>', '<path d="M10 11v6"/>', '<path d="M14 11v6"/>'],
  menu: ['<path d="M4 6h16"/>', '<path d="M4 12h16"/>', '<path d="M4 18h16"/>'],
  home: ['<path d="M4 11l8-7 8 7"/>', '<path d="M6 10v10h12V10"/>'],
  star: ['<path d="M12 3.6l2.5 5.1 5.6.8-4 3.9 1 5.5-5.1-2.7-5.1 2.7 1-5.5-4-3.9 5.6-.8z"/>'],
  quote: ['<path d="M9.5 7.5C7 8.2 5.5 10.3 5.5 12.9c0 1.9 1.1 3.2 2.6 3.2 1.4 0 2.4-1 2.4-2.4 0-1.3-1-2.2-2.2-2.2-.2 0-.4 0-.6.1.3-1.5 1.6-2.4 2.8-2.8z"/>', '<path d="M18.5 7.5c-2.5.7-4 2.8-4 5.4 0 1.9 1.1 3.2 2.6 3.2 1.4 0 2.4-1 2.4-2.4 0-1.3-1-2.2-2.2-2.2-.2 0-.4 0-.6.1.3-1.5 1.6-2.4 2.8-2.8z"/>'],
  minus: ['<path d="M5 12h14"/>'],
  plus: ['<path d="M12 5v14"/>', '<path d="M5 12h14"/>'],
  filter: ['<path d="M4 6h16"/>', '<path d="M7 12h10"/>', '<path d="M10 18h4"/>'],
  direction: ['<path d="M12 3l7 13.5L12 14l-7 2.5z"/>', '<path d="M12 3v11"/>'],
  bolt: ['<path d="M13 3L5 13h5l-1 8 8-10h-5z"/>'],
  eye: ['<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/>', '<circle cx="12" cy="12" r="3"/>'],
  sun: ['<circle cx="12" cy="12" r="4"/>', '<path d="M12 2.5v2"/>', '<path d="M12 19.5v2"/>', '<path d="M4.6 4.6l1.4 1.4"/>', '<path d="M18 18l1.4 1.4"/>', '<path d="M2.5 12h2"/>', '<path d="M19.5 12h2"/>', '<path d="M4.6 19.4L6 18"/>', '<path d="M18 6l1.4-1.4"/>'],
}

const filled = {
  star: ['M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],
}

const paths = props.filled ? (filled[props.name] || []) : (stroke[props.name] || [])
</script>
