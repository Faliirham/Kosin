import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoSection from '../../src/components/detail/InfoSection.vue'
import { clearFavorites } from '../../src/services/favorites'

const KOS = {
  id: 'kos-1',
  name: 'Kos Anggrek Putih',
  source: 'gmaps',
  address: 'Jl. Sudirman No. 5, Kec. Coblong, Kota Bandung',
  city: 'Bandung',
  district: 'Kec. Coblong',
  latitude: -6.9075,
  longitude: 107.6091,
  phone: '0812-1111-2222',
  website: 'https://kos.example.com',
  price_range: 'Mahal',
  rating: 4.8,
  total_reviews: 42,
  google_maps_url: 'https://maps.google.com',
  photos: [],
}

const toasts = []

function mountInfo(kos = KOS) {
  return mount(InfoSection, {
    props: { kos },
    global: {
      provide: {
        navigate: vi.fn(),
        toast: (msg, type) => toasts.push({ msg, type }),
      },
    },
  })
}

describe('InfoSection.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    clearFavorites()
    toasts.length = 0
    vi.restoreAllMocks()
  })

  it('renders WhatsApp action with a wa.me link from the local phone number', () => {
    const wrapper = mountInfo()
    expect(wrapper.find('.btn-wa').exists()).toBe(true)
    expect(wrapper.find('.btn-wa').text()).toContain('WhatsApp')
  })

  it('renders a directions action when coordinates are present', () => {
    const wrapper = mountInfo()
    expect(wrapper.find('.btn-outline').exists()).toBe(true)
  })

  it('hides WhatsApp and directions when no phone or coordinates', () => {
    const wrapper = mountInfo({ ...KOS, phone: null, latitude: null, longitude: null })
    expect(wrapper.find('.btn-wa').exists()).toBe(false)
  })

  it('copies the share link to clipboard and toasts success', async () => {
    const writeText = vi.fn().mockResolvedValue()
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mountInfo()
    const shareBtn = wrapper.findAll('.btn-outline').find(b => b.text().includes('Salin tautan'))
    await shareBtn.trigger('click')
    await Promise.resolve()
    expect(writeText).toHaveBeenCalledWith(window.location.href)
    expect(toasts).toEqual([{ msg: 'Tautan kos disalin ke papan klip', type: 'success' }])
  })

  it('toggles the favorite state from the detail page', async () => {
    const wrapper = mountInfo()
    const favBtn = wrapper.findAll('.btn-fav').find(b => b.text().includes('Simpan'))
    expect(favBtn.text()).toContain('Simpan')
    await favBtn.trigger('click')
    await Promise.resolve()
    expect(favBtn.text()).toContain('Tersimpan')
    expect(favBtn.attributes('aria-pressed')).toBe('true')
  })
})
