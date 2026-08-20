import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppIcon from '../../components/AppIcon.vue'

describe('AppIcon.vue', () => {
  it('renders an svg sized by the size prop', () => {
    const wrapper = mount(AppIcon, { props: { name: 'search', size: 24 } })
    const svg = wrapper.get('svg')
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
    expect(svg.classes()).toContain('icon-search')
  })

  it('renders full markup entries (circle + path) for stroke icons', () => {
    const wrapper = mount(AppIcon, { props: { name: 'search' } })
    expect(wrapper.findAll('svg circle').length).toBe(1)
    expect(wrapper.findAll('svg path').length).toBe(1)
    expect(wrapper.get('svg').attributes('stroke')).toBe('currentColor')
  })

  it('wraps raw d-strings for filled icons', () => {
    const wrapper = mount(AppIcon, { props: { name: 'star', filled: true } })
    const path = wrapper.get('svg path')
    expect(path.attributes('d')).toContain('M12 2.8')
    expect(wrapper.get('svg').attributes('fill')).toBe('currentColor')
    expect(wrapper.get('svg').attributes('stroke')).toBe('none')
  })

  it('renders multi-element icons like sun (9 painted elements)', () => {
    const wrapper = mount(AppIcon, { props: { name: 'sun', size: 18 } })
    expect(wrapper.findAll('svg circle, svg path').length).toBe(9)
  })

  it('renders nothing for an unknown icon name', () => {
    const wrapper = mount(AppIcon, { props: { name: 'does-not-exist' } })
    expect(wrapper.findAll('svg *').length).toBe(1) // hanya <g> kosong
  })

  it('supports rect-based icons (calendar)', () => {
    const wrapper = mount(AppIcon, { props: { name: 'calendar' } })
    expect(wrapper.findAll('svg rect').length).toBe(1)
    expect(wrapper.findAll('svg path').length).toBe(3)
  })

  it('is aria-hidden', () => {
    const wrapper = mount(AppIcon, { props: { name: 'home' } })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })
})
