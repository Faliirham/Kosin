// Parse teks rentang harga (mis. "Rp1.200.000/bulan", "1,2 jt", "800rb")
// menjadi nilai numerik IDR per bulan, untuk filter sisi klien.

export function parseMonthlyPrice(text) {
  if (!text) return null
  const raw = String(text).toLowerCase()
  const m = raw.match(/([\d][\d.,]*)\s*(jt|juta|ribu|rb|000)?/)
  if (!m) return null

  const num = m[1].replace(/\./g, '').replace(',', '.')
  const value = parseFloat(num)
  if (Number.isNaN(value)) return null

  const unit = m[2] || ''
  let idr
  if (unit.startsWith('jt') || unit.startsWith('juta')) idr = value * 1_000_000
  else if (unit.startsWith('rb') || unit.startsWith('ribu')) idr = value * 1_000
  else if (unit === '000') idr = value * 1_000
  else if (value > 1000) idr = value
  else idr = value * 1_000_000

  return Math.round(idr)
}
