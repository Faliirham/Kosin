import { describe, it, expect, vi } from 'vitest'
import { kosToCsv, downloadCsv } from '../../src/services/csv'

const KOS = {
  name: 'Kos "Anggrek", Bandung',
  city: 'Bandung',
  district: 'Kec. Coblong',
  address: 'Jl. Sudirman No. 5\nBandung',
  rating: 4.8,
  total_reviews: 42,
  phone: '0812-1111-2222',
  website: 'https://kos.example.com',
  price_range: 'Mahal',
  source: 'gmaps',
  latitude: -6.9075,
  longitude: 107.6091,
  google_maps_url: 'https://maps.google.com/?cid=1',
}

describe('csv.js', () => {
  it('writes a header row followed by one row per kos', () => {
    const csv = kosToCsv([{ ...KOS, address: 'Jl. Sudirman No. 5' }])
    const lines = csv.split('\n')
    expect(lines[0]).toContain('Nama')
    expect(lines[0]).toContain('Rentang Harga')
    expect(lines[1]).toContain('Bandung')
    expect(lines.length).toBe(2)
  })

  it('quotes and escapes commas, quotes, and newlines', () => {
    const csv = kosToCsv([KOS])
    expect(csv).toContain('"Kos ""Anggrek"", Bandung"')
    expect(csv).toContain('"Jl. Sudirman No. 5\nBandung"')
  })

  it('handles an empty list with only the header', () => {
    const csv = kosToCsv([])
    expect(csv.split('\n')).toHaveLength(1)
    expect(csv).toContain('Nama')
  })

  it('returns empty string for missing input', () => {
    expect(kosToCsv(null)).toBe('')
  })

  it('downloadCsv triggers a file download via blob URL', () => {
    const revoke = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:fake'),
      revokeObjectURL: revoke,
    })
    const click = vi.fn()
    vi.stubGlobal('document', {
      createElement: () => ({ click, remove: vi.fn() }),
      body: { appendChild: vi.fn() },
    })
    downloadCsv('kos-bandung.csv', 'Nama\nBandung')
    expect(click).toHaveBeenCalledTimes(1)
    expect(revoke).toHaveBeenCalled()
  })
})
