import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import KosCard from '../../components/KosCard.vue'
import { clearFavorites, toggleFavorite } from '../../utils/favorites'

const baseKos = {
  id: '1',
  name: 'Kos Anggrek Putih',
  source: 'gmaps',
  address: 'Jl. Sudirman No. 5, Kec. Coblong, Kota Bandung, Jawa Barat',
  city: 'Bandung',
  district: 'Kec. Coblong',
  latitude: -6.9075,
  longitude: 107.6091,
  rating: 4.8,
  total_reviews: 42,
  price_range: 'Mahal',
  photos: [],
  google_maps_url: 'https://maps.google.com',
}

describe('KosCard.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    clearFavorites()
  })

  it('renders name, address, and chips', () => {
    const wrapper = mount(KosCard, { props: { kos: baseKos } })
    expect(wrapper.get('.card-title').text()).toBe('Kos Anggrek Putih')
    expect(wrapper.get('.card-address').text()).toContain('Kec. Coblong')
    expect(wrapper.get('.chip-city').text()).toBe('Bandung')
    expect(wrapper.get('.chip-district').text()).toBe('Coblong')
    expect(wrapper.get('.chip-price').text()).toContain('Mahal')
  })

  it('shows rating badge with formatted rating and review count', () => {
    const wrapper = mount(KosCard, { props: { kos: baseKos } })
    const badge = wrapper.get('.rating-badge')
    expect(badge.text()).toContain('4.8')
    expect(badge.text()).toContain('(42)')
  })

  it('shows "Belum ada rating" chip when no rating', () => {
    const wrapper = mount(KosCard, { props: { kos: { ...baseKos, rating: null, total_reviews: null } } })
    expect(wrapper.get('.chip-na').text()).toBe('Belum ada rating')
    expect(wrapper.find('.rating-badge').exists()).toBe(false)
  })

  it('renders photo fallback with initial when no valid photo', () => {
    const wrapper = mount(KosCard, { props: { kos: { ...baseKos, photos: [] } } })
    expect(wrapper.get('.card-photo-fallback').exists()).toBe(true)
    expect(wrapper.get('.fallback-initial').text()).toBe('K')
  })

  it('renders photo img when photos[0] is a valid http url', () => {
    const wrapper = mount(KosCard, { props: { kos: { ...baseKos, photos: ['https://x.com/p.jpg'] } } })
    expect(wrapper.get('.card-photo img').attributes('src')).toBe('https://x.com/p.jpg')
  })

  it('labels source as Google for gmaps and OSM otherwise', () => {
    const g = mount(KosCard, { props: { kos: baseKos } })
    expect(g.get('.source-tag').text()).toContain('Google')
    const o = mount(KosCard, { props: { kos: { ...baseKos, source: 'osm' } } })
    expect(o.get('.source-tag').text()).toContain('OSM')
  })

  it('emits click on click, enter, and space', async () => {
    const wrapper = mount(KosCard, { props: { kos: baseKos } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    await wrapper.trigger('keydown.enter')
    await wrapper.trigger('keydown.space')
    expect(wrapper.emitted('click')).toHaveLength(3)
  })

  it('strips "Kec." prefix from district chip', () => {
    const wrapper = mount(KosCard, { props: { kos: baseKos } })
    expect(wrapper.get('.chip-district').text()).not.toContain('Kec.')
  })

  it('renders a favorite button and toggles it without emitting card click', async () => {
    const wrapper = mount(KosCard, { props: { kos: baseKos } })
    const btn = wrapper.get('.fav-btn')
    expect(btn.attributes('aria-pressed')).toBe('false')
    expect(btn.find('.icon-heart').attributes('fill')).toBe('none')

    await btn.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(btn.attributes('aria-pressed')).toBe('true')
    expect(btn.find('.icon-heart').attributes('fill')).toBe('currentColor')

    await btn.trigger('click')
    expect(btn.attributes('aria-pressed')).toBe('false')
  })

  it('reflects an already-favorited kos with the active state', () => {
    toggleFavorite(baseKos)
    const wrapper = mount(KosCard, { props: { kos: baseKos } })
    expect(wrapper.get('.fav-btn').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.fav-btn').classes()).toContain('active')
  })
})
