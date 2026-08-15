import { describe, it, expect, beforeEach } from 'vitest'
import {
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  recentSearches,
} from '../../src/services/history'

describe('history.js', () => {
  beforeEach(() => {
    localStorage.clear()
    clearRecentSearches()
  })

  it('starts empty', () => {
    expect(recentSearches()).toEqual([])
  })

  it('stores a search with city, district, and keyword', () => {
    addRecentSearch({ city: 'Bandung', district: 'Coblong', keyword: 'kos murah' })
    expect(recentSearches()).toEqual([
      { city: 'Bandung', district: 'Coblong', keyword: 'kos murah' },
    ])
  })

  it('defaults missing keyword and district', () => {
    addRecentSearch({ city: 'Jakarta' })
    expect(recentSearches()[0]).toEqual({ city: 'Jakarta', district: '', keyword: 'kos kosan' })
  })

  it('ignores empty city', () => {
    addRecentSearch({ city: '  ' })
    addRecentSearch({ city: '' })
    expect(recentSearches()).toEqual([])
  })

  it('de-duplicates identical city+district searches (case-insensitive)', () => {
    addRecentSearch({ city: 'Bandung', district: 'Coblong' })
    addRecentSearch({ city: 'bandung', district: 'coblong', keyword: 'kos mahasiswa' })
    expect(recentSearches()).toHaveLength(1)
    expect(recentSearches()[0].keyword).toBe('kos mahasiswa')
  })

  it('keeps at most 5 recent searches, most recent first', () => {
    for (const c of ['A', 'B', 'C', 'D', 'E', 'F']) {
      addRecentSearch({ city: c })
    }
    expect(recentSearches()).toHaveLength(5)
    expect(recentSearches().map(r => r.city)).toEqual(['F', 'E', 'D', 'C', 'B'])
  })

  it('persists to localStorage', () => {
    addRecentSearch({ city: 'Surabaya', district: 'Wonokromo' })
    const stored = JSON.parse(localStorage.getItem('kos-recent'))
    expect(stored[0].city).toBe('Surabaya')
  })

  it('removeRecentSearch removes only the matching entry', () => {
    addRecentSearch({ city: 'Bandung', district: 'Coblong' })
    addRecentSearch({ city: 'Jakarta', district: 'Menteng' })
    removeRecentSearch({ city: 'bandung', district: 'coblong' })
    expect(recentSearches().map(r => r.city)).toEqual(['Jakarta'])
  })

  it('clearRecentSearches empties both memory and storage', () => {
    addRecentSearch({ city: 'Bandung' })
    clearRecentSearches()
    expect(recentSearches()).toEqual([])
    expect(localStorage.getItem('kos-recent')).toBe('[]')
  })
})
