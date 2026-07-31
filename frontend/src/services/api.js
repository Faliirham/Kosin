import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

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

export async function triggerScrape(city, keyword = 'kos kosan') {
  const res = await api.post('/scrape', { city, keyword })
  return res.data
}

export async function healthCheck() {
  const res = await api.get('/health')
  return res.data
}
