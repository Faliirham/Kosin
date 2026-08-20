const STORAGE_KEY = 'kos-theme'

const listeners = new Set()

function emitThemeChange() {
  const theme = resolveTheme()
  for (const fn of listeners) fn(theme)
}

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme() {
  const stored = getStoredTheme()
  return stored === 'light' || stored === 'dark' ? stored : getSystemTheme()
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#0f172a')
  }
}

export function initTheme() {
  applyTheme(resolveTheme())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light')
      emitThemeChange()
    }
  })
}

export function onThemeChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // storage tidak tersedia — tetap terapkan untuk sesi ini
  }
  applyTheme(theme)
  emitThemeChange()
}

export function toggleTheme() {
  const next = resolveTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}