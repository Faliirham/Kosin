export function phoneToWa(phone) {
  if (!phone || typeof phone !== 'string') return ''
  const digits = phone.replace(/\D/g, '')
  if (!digits) return ''
  let intl = digits
  if (intl.startsWith('0')) {
    intl = '62' + intl.slice(1)
  } else if (!intl.startsWith('62')) {
    intl = '62' + intl
  }
  return `https://wa.me/${intl}`
}

export function directionsUrl(lat, lng) {
  if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return ''
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export function currentShareUrl() {
  return window.location.href
}
