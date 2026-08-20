import { describe, it, expect, beforeEach } from 'vitest'
import {
  isFavorite,
  toggleFavorite,
  favoritesCount,
  favoriteIds,
  favoritePlaceIds,
  clearFavorites,
} from '../../utils/favorites'

const KOS_A = { id: 'a-1', place_id: 'ChIJ-a', name: 'Kos A', city: 'Bandung' }
const KOS_B = { id: 'b-2', place_id: 'ChIJ-b', name: 'Kos B', city: 'Jakarta' }

describe('favorites.js', () => {
  beforeEach(() => {
    localStorage.clear()
    clearFavorites()
  })

  it('starts empty', () => {
    expect(favoritesCount()).toBe(0)
    expect(isFavorite(KOS_A)).toBe(false)
  })

  it('toggles a kos in and out of favorites', () => {
    expect(toggleFavorite(KOS_A)).toBe(true)
    expect(isFavorite(KOS_A)).toBe(true)
    expect(favoritesCount()).toBe(1)

    expect(toggleFavorite(KOS_A)).toBe(false)
    expect(isFavorite(KOS_A)).toBe(false)
    expect(favoritesCount()).toBe(0)
  })

  it('persists favorites to localStorage and rehydrates on read', () => {
    toggleFavorite(KOS_A)
    toggleFavorite(KOS_B)
    expect(favoritesCount()).toBe(2)

    const stored = JSON.parse(localStorage.getItem('kos-favorites'))
    expect(stored).toHaveLength(2)
    expect(stored[0].id).toBe('b-2')
    expect(stored[1].id).toBe('a-1')
  })

  it('matches favorites by place_id even when id differs', () => {
    toggleFavorite(KOS_A)
    expect(isFavorite({ id: 'different-uuid', place_id: 'ChIJ-a', name: 'Kos A' })).toBe(true)
  })

  it('ignores kos without any stable id', () => {
    expect(toggleFavorite({ name: 'Anonim' })).toBe(false)
    expect(favoritesCount()).toBe(0)
  })

  it('exposes id and place_id sets for filtering', () => {
    toggleFavorite(KOS_A)
    toggleFavorite(KOS_B)
    expect([...favoriteIds()]).toEqual(['b-2', 'a-1'])
    expect(favoritePlaceIds().has('ChIJ-a')).toBe(true)
    expect(favoritePlaceIds().has('ChIJ-b')).toBe(true)
  })

  it('clearFavorites empties both memory and storage', () => {
    toggleFavorite(KOS_A)
    clearFavorites()
    expect(favoritesCount()).toBe(0)
    expect(isFavorite(KOS_A)).toBe(false)
    expect(localStorage.getItem('kos-favorites')).toBe('[]')
  })
})
