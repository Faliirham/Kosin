import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { isHttpUrl, fetchKos, fetchKosDetail, deleteKos, triggerScrape, healthCheck, fetchStats } from '../../src/services/api'

vi.mock('axios', () => {
  const api = { get: vi.fn(), post: vi.fn(), delete: vi.fn() }
  return { default: { create: () => api }, __api: api }
})

const api = vi.mocked(axios).create()

describe('api.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isHttpUrl', () => {
    it('accepts http and https urls', () => {
      expect(isHttpUrl('https://maps.google.com/photo.jpg')).toBe(true)
      expect(isHttpUrl('http://example.com/x')).toBe(true)
    })

    it('rejects non-http protocols and garbage', () => {
      expect(isHttpUrl('ftp://example.com')).toBe(false)
      expect(isHttpUrl('data:image/png;base64,abc')).toBe(false)
      expect(isHttpUrl('not a url')).toBe(false)
      expect(isHttpUrl('')).toBe(false)
      expect(isHttpUrl(null)).toBe(false)
      expect(isHttpUrl(undefined)).toBe(false)
    })
  })

  it('fetchKos sends GET /kos with params', async () => {
    api.get.mockResolvedValue({ data: { data: [], total: 0 } })
    await fetchKos({ city: 'Bandung', limit: 20 })
    expect(api.get).toHaveBeenCalledWith('/kos', { params: { city: 'Bandung', limit: 20 } })
  })

  it('fetchKosDetail sends GET /kos/{id}', async () => {
    api.get.mockResolvedValue({ data: { id: '1' } })
    const res = await fetchKosDetail('abc-123')
    expect(api.get).toHaveBeenCalledWith('/kos/abc-123')
    expect(res.id).toBe('1')
  })

  it('deleteKos sends DELETE /kos/{id}', async () => {
    api.delete.mockResolvedValue({ data: { message: 'ok' } })
    await deleteKos('abc')
    expect(api.delete).toHaveBeenCalledWith('/kos/abc')
  })

  it('triggerScrape posts city, keyword, and district with long timeout', async () => {
    api.post.mockResolvedValue({ data: { total_scraped: 3 } })
    const res = await triggerScrape('Bandung', 'kos murah', 'Coblong')
    expect(api.post).toHaveBeenCalledWith(
      '/scrape',
      { city: 'Bandung', keyword: 'kos murah', district: 'Coblong' },
      { timeout: 120_000 }
    )
    expect(res.total_scraped).toBe(3)
  })

  it('healthCheck hits /health', async () => {
    api.get.mockResolvedValue({ data: { status: 'ok' } })
    await expect(healthCheck()).resolves.toEqual({ status: 'ok' })
  })

  it('fetchStats reads aggregate totals from /stats', async () => {
    api.get.mockResolvedValue({
      data: { total: 10, avg_rating: 4.5, cities: ['Bandung', 'Jakarta'] },
    })
    const stats = await fetchStats()
    expect(api.get).toHaveBeenCalledWith('/stats')
    expect(stats.total).toBe(10)
    expect(stats.avgRating).toBeCloseTo(4.5)
    expect(stats.cities).toEqual(['Bandung', 'Jakarta'])
  })
})
