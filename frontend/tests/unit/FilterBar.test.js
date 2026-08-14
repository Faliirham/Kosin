import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterBar from '../../src/components/FilterBar.vue'

describe('FilterBar.vue', () => {
  it('disables the scrape button without a city', () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('emits scrape with city, keyword, and district on submit', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('input[aria-label="Nama kota"]').setValue('Bandung')
    await wrapper.get('input[aria-label="Keyword pencarian"]').setValue('kos murah')
    await wrapper.get('input[aria-label="Kecamatan atau kelurahan"]').setValue('Coblong')
    await wrapper.get('form.scrape-row').trigger('submit')
    expect(wrapper.emitted('scrape')[0][0]).toEqual({
      city: 'Bandung',
      keyword: 'kos murah',
      district: 'Coblong',
    })
  })

  it('emits district as undefined when left empty', async () => {
    const wrapper = mount(FilterBar, { props: { loading: false, scraping: false, filters: {} } })
    await wrapper.get('input[aria-label="Nama kota"]').setValue('Jakarta')
    await wrapper.get('form.scrape-row').trigger('submit')
    expect(wrapper.emitted('scrape')[0][0].district).toBeUndefined()
  })

  it('syncs filter controls from the filters prop', async () => {
    const wrapper = mount(FilterBar, {
      props: { loading: false, scraping: false, filters: { city: 'Bandung', min_rating: 4, sort: 'rating' } },
    })
    await wrapper.setProps({ filters: { city: 'Bandung', min_rating: 4, sort: 'rating' } })
    expect(wrapper.get('input[aria-label="Filter kota"]').element.value).toBe('Bandung')
    expect(wrapper.get('select[aria-label="Rating minimal"]').element.value).toBe('4')
    expect(wrapper.get('select[aria-label="Urutkan"]').element.value).toBe('rating')
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
})
