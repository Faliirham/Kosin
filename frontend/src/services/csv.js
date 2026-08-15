function escapeCell(value) {
  const s = value == null ? '' : String(value)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

const HEADERS = [
  'Nama',
  'Kota',
  'Kecamatan',
  'Alamat',
  'Rating',
  'Jumlah Ulasan',
  'Telepon',
  'Website',
  'Rentang Harga',
  'Sumber',
  'Latitude',
  'Longitude',
  'Link Google Maps',
]

export function kosToCsv(kosList) {
  if (kosList == null) return ''
  const rows = kosList.map(k => [
    k.name,
    k.city,
    k.district,
    k.address,
    k.rating,
    k.total_reviews,
    k.phone,
    k.website,
    k.price_range,
    k.source,
    k.latitude,
    k.longitude,
    k.google_maps_url,
  ])
  return [HEADERS, ...rows].map(row => row.map(escapeCell).join(',')).join('\n')
}

export function downloadCsv(filename, csv) {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
