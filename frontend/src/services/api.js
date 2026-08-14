import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60_000,
})

export function isHttpUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export async function fetchKos(params = {}) {
  const res = await api.get('/kos', { params })
  return res.data
}

export async function fetchKosDetail(id) {
  const res = await api.get(`/kos/${id}`)
  return res.data
}

export async function deleteKos(id) {
  const res = await api.delete(`/kos/${id}`)
  return res.data
}

export async function triggerScrape(city, keyword = 'kos kosan', district) {
  const res = await api.post('/scrape', { city, keyword, district }, { timeout: 120_000 })
  return res.data
}

export async function healthCheck() {
  const res = await api.get('/health')
  return res.data
}

export async function fetchStats() {
  const [{ data: summary }, { data: sample }] = await Promise.all([
    api.get('/kos', { params: { limit: 1 } }),
    api.get('/kos', { params: { limit: 100, sort: 'rating', order: 'desc' } }),
  ])
  const rated = sample.data.filter(k => k.rating)
  const cities = [...new Set(sample.data.map(k => k.city).filter(Boolean))]
  return {
    total: summary.total || 0,
    avgRating: rated.length
      ? rated.reduce((sum, k) => sum + k.rating, 0) / rated.length
      : 0,
    cities,
  }
}
