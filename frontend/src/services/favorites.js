import { reactive } from 'vue'

const STORAGE_KEY = 'kos-favorites'
const MAX_ITEMS = 200

function readFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter(f => f && (f.id || f.place_id)) : []
  } catch {
    return []
  }
}

const favorites = reactive({ items: readFavorites() })

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.items))
  } catch {
    // storage tidak tersedia — non-blocking
  }
}

function matchesAny(f, kos) {
  return !!(kos?.id && f.id === kos.id) || !!(kos?.place_id && f.place_id === kos.place_id)
}

export function isFavorite(kos) {
  if (!kos || (!kos.id && !kos.place_id)) return false
  return favorites.items.some(f => matchesAny(f, kos))
}

export function toggleFavorite(kos) {
  if (!kos || (!kos.id && !kos.place_id)) return false
  const idx = favorites.items.findIndex(f => matchesAny(f, kos))
  if (idx >= 0) {
    favorites.items.splice(idx, 1)
    persist()
    return false
  }
  favorites.items.unshift({
    id: kos.id,
    place_id: kos.place_id,
    name: kos.name,
    city: kos.city,
    district: kos.district,
  })
  favorites.items = favorites.items.slice(0, MAX_ITEMS)
  persist()
  return true
}

export function favoritesCount() {
  return favorites.items.length
}

export function clearFavorites() {
  favorites.items = []
  persist()
}

export function favoriteIds() {
  return new Set(favorites.items.map(f => f.id).filter(Boolean))
}

export function favoritePlaceIds() {
  return new Set(favorites.items.map(f => f.place_id).filter(Boolean))
}

export function isKosFavorite(kos) {
  return isFavorite(kos)
}
