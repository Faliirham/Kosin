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
  const res = await api.get('/stats')
  return {
    total: res.data.total || 0,
    avgRating: res.data.avg_rating || 0,
    cities: res.data.cities || [],
  }
}
