import { describe, it, expect } from 'vitest'
import { phoneToWa, directionsUrl, currentShareUrl } from '../../src/services/contact'

describe('contact.js', () => {
  describe('phoneToWa', () => {
    it('converts a leading-zero Indonesian number to international format', () => {
      expect(phoneToWa('0812-1111-2222')).toBe('https://wa.me/6281211112222')
      expect(phoneToWa('081234567890')).toBe('https://wa.me/6281234567890')
    })

    it('keeps numbers already in 62 format', () => {
      expect(phoneToWa('6281234567890')).toBe('https://wa.me/6281234567890')
      expect(phoneToWa('+6281234567890')).toBe('https://wa.me/6281234567890')
    })

    it('prefixes 62 to numbers without a country code', () => {
      expect(phoneToWa('81234567890')).toBe('https://wa.me/6281234567890')
    })

    it('returns empty for missing or non-numeric input', () => {
      expect(phoneToWa('')).toBe('')
      expect(phoneToWa(null)).toBe('')
      expect(phoneToWa(undefined)).toBe('')
      expect(phoneToWa('tanpa nomor')).toBe('')
    })
  })

  describe('directionsUrl', () => {
    it('builds a Google Maps directions URL from coordinates', () => {
      expect(directionsUrl(-6.9075, 107.6091)).toBe(
        'https://www.google.com/maps/dir/?api=1&destination=-6.9075,107.6091'
      )
    })

    it('returns empty when coordinates are missing', () => {
      expect(directionsUrl(null, null)).toBe('')
      expect(directionsUrl(undefined, 107)).toBe('')
      expect(directionsUrl('x', 'y')).toBe('')
    })
  })

  describe('currentShareUrl', () => {
    it('returns the current location href', () => {
      const href = 'http://localhost/#/kos/abc'
      Object.defineProperty(window, 'location', {
        value: { href },
        writable: true,
      })
      expect(currentShareUrl()).toBe(href)
    })
  })
})
