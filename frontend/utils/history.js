import { reactive } from 'vue'

const STORAGE_KEY = 'kos-recent'
const MAX_ITEMS = 5

function readRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(raw)
      ? raw.filter(r => r && typeof r.city === 'string' && r.city.trim())
      : []
  } catch {
    return []
  }
}

const recent = reactive({ items: readRecent() })

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.items))
  } catch {
    // storage tidak tersedia — non-blocking
  }
}

function sameSearch(a, b) {
  return (
    String(a.city || '').toLowerCase() === String(b.city || '').toLowerCase() &&
    String(a.district || '').toLowerCase() === String(b.district || '').toLowerCase() &&
    String(a.kelurahan || '').toLowerCase() === String(b.kelurahan || '').toLowerCase()
  )
}

export function addRecentSearch({ city, district, kelurahan, keyword }) {
  if (!city || !String(city).trim()) return
  const entry = {
    city: String(city).trim(),
    district: district ? String(district).trim() : '',
    kelurahan: kelurahan ? String(kelurahan).trim() : '',
    keyword: keyword && String(keyword).trim() ? String(keyword).trim() : 'kos kosan',
  }
  recent.items = recent.items.filter(r => !sameSearch(r, entry))
  recent.items.unshift(entry)
  recent.items = recent.items.slice(0, MAX_ITEMS)
  persist()
}

export function removeRecentSearch({ city, district, kelurahan }) {
  recent.items = recent.items.filter(r => !sameSearch(r, { city, district, kelurahan }))
  persist()
}

export function clearRecentSearches() {
  recent.items = []
  persist()
}

export function recentSearches() {
  return recent.items
}
