import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterBar from '../../src/components/FilterBar.vue'
import { addRecentSearch, clearRecentSearches } from '../../src/services/history'

describe('FilterBar.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    clearRecentSearches()
  })

  it('disables the scrape button without a city', () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('emits scrape with city, keyword, district, and kelurahan on submit', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('input[aria-label="Nama kota"]').setValue('Surabaya')
    await wrapper.get('input[aria-label="Keyword pencarian"]').setValue('kos murah')
    await wrapper.get('input[aria-label="Kecamatan"]').setValue('Tandes')
    await wrapper.get('input[aria-label="Kelurahan"]').setValue('Manukan')
    await wrapper.get('form.scrape-form').trigger('submit')
    expect(wrapper.emitted('scrape')[0][0]).toEqual({
      city: 'Surabaya',
      keyword: 'kos murah',
      district: 'Tandes',
      kelurahan: 'Manukan',
    })
  })

  it('emits district and kelurahan as undefined when left empty', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('input[aria-label="Nama kota"]').setValue('Jakarta')
    await wrapper.get('form.scrape-form').trigger('submit')
    expect(wrapper.emitted('scrape')[0][0].district).toBeUndefined()
    expect(wrapper.emitted('scrape')[0][0].kelurahan).toBeUndefined()
  })

  it('syncs filter controls from the filters prop', async () => {
    const wrapper = mount(FilterBar, {
      props: { loading: false, scraping: false, filters: { city: 'Bandung', min_rating: 4, sort: 'rating' } },
    })
    await wrapper.setProps({ filters: { city: 'Bandung', kelurahan: 'Dago', min_rating: 4, sort: 'rating' } })
    expect(wrapper.get('input[aria-label="Filter kota"]').element.value).toBe('Bandung')
    expect(wrapper.get('input[aria-label="Filter kelurahan"]').element.value).toBe('Dago')
    expect(wrapper.get('select[aria-label="Rating minimal"]').element.value).toBe('4')
    expect(wrapper.get('select[aria-label="Urutkan"]').element.value).toBe('rating')
  })

  it('emits kelurahan in the filter payload', async () => {
    vi.useFakeTimers()
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('input[aria-label="Filter kelurahan"]').setValue('Manukan')
    vi.advanceTimersByTime(400)
    const payload = wrapper.emitted('filter')[0][0]
    expect(payload.kelurahan).toBe('Manukan')
    expect(payload.district).toBeUndefined()
    vi.useRealTimers()
  })

  it('emits filter (debounced) when typing search', async () => {
    vi.useFakeTimers()
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('input[aria-label="Cari kos"]').setValue('anggrek')
    vi.advanceTimersByTime(400)
    expect(wrapper.emitted('filter')[0][0].search).toBe('anggrek')
    vi.useRealTimers()
  })

  it('emits filter immediately on sort change', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('select[aria-label="Urutkan"]').setValue('rating')
    const payload = wrapper.emitted('filter')[0][0]
    expect(payload.sort).toBe('rating')
    expect(payload.search).toBeUndefined()
  })

  it('shows scrape status line while scraping a city', async () => {
    const wrapper = mount(FilterBar, {
      props: { loading: false, scraping: true, filters: {}, initialCity: '' },
    })
    await wrapper.get('input[aria-label="Nama kota"]').setValue('Bandung')
    const status = wrapper.find('.scrape-status')
    expect(status.exists()).toBe(true)
    expect(status.text()).toContain('Bandung')
  })

  it('renders recent search chips and re-runs the search on click', async () => {
    addRecentSearch({ city: 'Surabaya', district: 'Tandes', kelurahan: 'Manukan', keyword: 'kos murah' })
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })

    const chip = wrapper.get('.recent-chip')
    expect(chip.text()).toContain('Surabaya')
    expect(chip.text()).toContain('Tandes')
    expect(chip.text()).toContain('Manukan')

    await chip.trigger('click')
    expect(wrapper.emitted('scrape')[0][0]).toEqual({
      city: 'Surabaya',
      district: 'Tandes',
      kelurahan: 'Manukan',
      keyword: 'kos murah',
    })
  })

  it('hides recent chips when history is empty', () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    expect(wrapper.find('.recent-row').exists()).toBe(false)
  })

  it('clears recent history from the clear button', async () => {
    addRecentSearch({ city: 'Bandung' })
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('.recent-clear').trigger('click')
    expect(wrapper.find('.recent-row').exists()).toBe(false)
  })

  it('emits filter with favorites_only when the favorites toggle is activated', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('.btn-fav').trigger('click')
    const payload = wrapper.emitted('filter')[0][0]
    expect(payload.favorites_only).toBe(true)
  })

  it('reflects favorites_only from the filters prop', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.setProps({ filters: { favorites_only: true } })
    expect(wrapper.get('.btn-fav').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.btn-fav').classes()).toContain('active')
  })
})
