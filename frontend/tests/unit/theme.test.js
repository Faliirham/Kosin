import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getStoredTheme,
  getSystemTheme,
  resolveTheme,
  applyTheme,
  initTheme,
  setTheme,
  toggleTheme,
} from '../../utils/theme'

describe('theme.js', () => {
  let listeners

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.stubGlobal('matchMedia', (query) => ({
      matches: query.includes('prefers-color-scheme') && query.includes('dark') ? false : false,
      addEventListener: (_type, fn) => listeners.push(fn),
      removeEventListener: () => {},
    }))
    listeners = []
    document.querySelectorAll('meta').forEach((m) => {
      if (m.name === 'theme-color') m.remove()
    })
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  })

  it('getStoredTheme returns null when nothing is stored', () => {
    expect(getStoredTheme()).toBeNull()
  })

  it('getSystemTheme reflects prefers-color-scheme', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {} }))
    expect(getSystemTheme()).toBe('dark')
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {} }))
    expect(getSystemTheme()).toBe('light')
  })

  it('resolveTheme prefers stored value over system', () => {
    localStorage.setItem('kos-theme', 'dark')
    expect(resolveTheme()).toBe('dark')
  })

  it('resolveTheme falls back to system when nothing stored', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {} }))
    expect(resolveTheme()).toBe('dark')
  })

  it('resolveTheme ignores invalid stored values', () => {
    localStorage.setItem('kos-theme', 'sepia')
    expect(['light', 'dark']).toContain(resolveTheme())
  })

  it('applyTheme sets data-theme attribute and theme-color meta', () => {
    applyTheme('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(document.querySelector('meta[name="theme-color"]').content).toBe('#0b1220')

    applyTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]').content).toBe('#0f172a')
  })

  it('setTheme persists to localStorage', () => {
    setTheme('dark')
    expect(localStorage.getItem('kos-theme')).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggleTheme flips theme and returns it', () => {
    setTheme('light')
    expect(toggleTheme()).toBe('dark')
    expect(localStorage.getItem('kos-theme')).toBe('dark')
    expect(toggleTheme()).toBe('light')
  })

  it('initTheme applies stored theme and reacts to system changes only when no stored theme', () => {
    localStorage.setItem('kos-theme', 'dark')
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    localStorage.removeItem('kos-theme')
    let handler
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: (_t, fn) => { handler = fn },
    }))
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    handler({ matches: true })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
