// Ilustrasi SVG inline (tanpa dependensi eksternal) untuk mengganti
// gambar picsum yang acak. Konsisten dengan palet brand Kos Finder.

function svgDataUri(inner) {
  return (
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1150">${inner}</svg>`)
  )
}

const ROOM = `
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dbeafe"/>
      <stop offset="1" stop-color="#eff6ff"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f1e7d8"/>
      <stop offset="1" stop-color="#e7d8c2"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1150" fill="url(#wall)"/>
  <rect y="820" width="900" height="330" fill="url(#floor)"/>
  <rect x="540" y="120" width="320" height="380" rx="10" fill="#bfdbfe"/>
  <rect x="540" y="120" width="320" height="380" rx="10" fill="none" stroke="#ffffff" stroke-width="10"/>
  <line x1="700" y1="120" x2="700" y2="500" stroke="#ffffff" stroke-width="8"/>
  <line x1="540" y1="310" x2="860" y2="310" stroke="#ffffff" stroke-width="8"/>
  <circle cx="620" cy="215" r="34" fill="#fde68a"/>
  <rect x="60" y="560" width="40" height="300" rx="10" fill="#1e3a8a"/>
  <rect x="80" y="640" width="560" height="190" rx="18" fill="#2563eb"/>
  <rect x="80" y="600" width="560" height="80" rx="18" fill="#3b82f6"/>
  <rect x="110" y="602" width="150" height="70" rx="14" fill="#ffffff"/>
  <rect x="280" y="602" width="150" height="70" rx="14" fill="#e0e7ff"/>
  <rect x="80" y="770" width="560" height="60" rx="14" fill="#1e40af"/>
  <rect x="700" y="740" width="120" height="120" rx="10" fill="#92400e"/>
  <rect x="745" y="640" width="30" height="100" fill="#b45309"/>
  <path d="M720 640 L800 640 L785 588 L735 588 Z" fill="#fcd34d"/>
  <rect x="820" y="760" width="60" height="100" rx="8" fill="#b45309"/>
  <circle cx="850" cy="718" r="44" fill="#22c55e"/>
  <circle cx="820" cy="740" r="30" fill="#16a34a"/>
  <circle cx="880" cy="740" r="30" fill="#16a34a"/>
  <ellipse cx="380" cy="985" rx="260" ry="42" fill="#c7d2fe"/>
`

export const roomIllustration = svgDataUri(ROOM)
