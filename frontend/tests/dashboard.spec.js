import { test, expect } from '@playwright/test'

const SAMPLE_KOS = [
  {
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
    photos: ['https://picsum.photos/seed/kos-1/640/360'],
    google_maps_url: 'https://maps.google.com',
  },
  {
    id: '2',
    name: 'Kos Griya Melati',
    source: 'gmaps',
    address: 'Jl. Dago Asri No. 12, Kec. Cidadap, Kota Bandung, Jawa Barat',
    city: 'Bandung',
    district: 'Kec. Cidadap',
    latitude: -6.8667,
    longitude: 107.6167,
    rating: 4.5,
    total_reviews: 18,
    price_range: 'Sedang',
    photos: ['https://picsum.photos/seed/kos-2/640/360'],
  },
  {
    id: '3',
    name: 'Kos Permata Hijau',
    source: 'gmaps',
    address: 'Jl. Setiabudi No. 77, Kec. Sukasari, Kota Bandung, Jawa Barat',
    city: 'Bandung',
    district: 'Kec. Sukasari',
    latitude: -6.855,
    longitude: 107.6025,
    rating: null,
    total_reviews: null,
    photos: ['https://picsum.photos/seed/kos-3/640/360'],
  },
  {
    id: '4',
    name: 'Kos Sultan Residence',
    source: 'gmaps',
    address: 'Jl. Ahmad Yani No. 21, Kec. Batununggal, Kota Bandung, Jawa Barat',
    city: 'Bandung',
    district: 'Kec. Batununggal',
    latitude: -6.92,
    longitude: 107.63,
    rating: 4.2,
    total_reviews: 65,
    price_range: 'Murah',
    photos: ['https://picsum.photos/seed/kos-4/640/360'],
  },
  {
    id: '5',
    name: 'Kos Damai Jaya',
    source: 'osm',
    address: 'Jl. Pahlawan No. 3, Kec. Cicendo, Kota Bandung, Jawa Barat',
    city: 'Bandung',
    district: 'Kec. Cicendo',
    latitude: -6.914,
    longitude: 107.59,
    rating: 3.9,
    total_reviews: 8,
    photos: ['https://picsum.photos/seed/kos-5/640/360'],
  },
  {
    id: '6',
    name: 'Kos Ampera Homestay',
    source: 'gmaps',
    address: 'Jl. Antapani No. 9, Kec. Antapani, Kota Bandung, Jawa Barat',
    city: 'Bandung',
    district: 'Kec. Antapani',
    latitude: -6.9135,
    longitude: 107.6622,
    rating: 4.7,
    total_reviews: 31,
    price_range: 'Sedang',
    photos: ['https://picsum.photos/seed/kos-6/640/360'],
  },
]

function kosPayload(items = SAMPLE_KOS) {
  return { data: items, total: items.length }
}

async function stubApi(page, options = {}) {
  const {
    delay = 0,
    items = SAMPLE_KOS,
    scrapeDelay = 0,
    scrapeStatus = 200,
    scrapeResponse = {
      message: 'Scrape selesai',
      total_scraped: 2,
      areas: [
        { district: 'Kec. Coblong', count: 16 },
        { district: 'Kec. Cicendo', count: 5 },
        { district: 'Kec. Lengkong', count: 4 },
        { district: 'Kec. Antapani', count: 3 },
      ],
    },
  } = options

  // Google Maps JS can't load in CI/headless — abort it so the map shows its
  // deterministic error state instead of depending on external network.
  await page.route('**://maps.googleapis.com/**', route => route.abort())

  await page.route('**/api/kos**', async route => {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay))
    await route.fulfill({ json: kosPayload(items) })
  })

  await page.route('**/api/scrape', async route => {
    if (scrapeDelay) await new Promise(resolve => setTimeout(resolve, scrapeDelay))
    if (scrapeStatus !== 200) {
      await route.fulfill({ status: scrapeStatus, json: { detail: 'Kunci API tidak valid' } })
      return
    }
    await route.fulfill({ json: scrapeResponse })
  })
}

test.describe('search results render identically across breakpoints', () => {
  test('desktop: skeleton resolves into full kos cards in a two-column layout', async ({ page }) => {
    test.setTimeout(30_000)
    await page.setViewportSize({ width: 1280, height: 800 })
    await stubApi(page, { delay: 1500 })
    await page.goto('/#/dashboard')

    const skeleton = page.locator('.loading-grid')
    await expect(skeleton).toBeVisible()

    const cards = page.locator('.kos-card')
    await expect(cards).toHaveCount(6, { timeout: 15_000 })
    await expect(skeleton).toHaveCount(0)

    const first = cards.first()
    await expect(first.locator('.card-title')).toHaveText('Kos Anggrek Putih')
    await expect(first.locator('.source-tag')).toContainText('Google')
    await expect(first.locator('.rating-badge')).toContainText('4.8')
    await expect(first.locator('.card-address')).toContainText('Kec. Coblong')
    await expect(first.locator('.chip-city')).toContainText('Bandung')
    await expect(first.locator('.chip-district')).toContainText('Coblong')

    await expect(cards.nth(2).locator('.chip-na')).toContainText('Belum ada rating')
    await expect(cards.nth(4).locator('.source-tag')).toContainText('OSM')

    const cols = await page
      .locator('.content')
      .evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
    expect(cols).toBe(2)
    await expect(page.locator('.map-container')).toBeVisible()

    // Regression guard: the scrollable list must never squeeze cards (flex
    // shrink bug made desktop cards collapse to a few pixels tall).
    const firstHeight = await first.evaluate(el => el.getBoundingClientRect().height)
    expect(firstHeight).toBeGreaterThan(150)
  })

  test('mobile: same kos cards render in a single-column layout', async ({ page }) => {
    test.setTimeout(30_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await stubApi(page, { delay: 800 })
    await page.goto('/#/dashboard')

    const cards = page.locator('.kos-card')
    await expect(cards).toHaveCount(6, { timeout: 15_000 })

    const first = cards.first()
    await expect(first.locator('.card-title')).toHaveText('Kos Anggrek Putih')
    await expect(first.locator('.source-tag')).toContainText('Google')
    await expect(first.locator('.rating-badge')).toContainText('4.8')
    await expect(first.locator('.card-address')).toContainText('Kec. Coblong')
    await expect(first.locator('.chip-city')).toContainText('Bandung')
    await expect(first.locator('.chip-district')).toContainText('Coblong')

    const cols = await page
      .locator('.content')
      .evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
    expect(cols).toBe(1)
    await expect(page.locator('.map-container')).toBeVisible()

    const firstHeight = await first.evaluate(el => el.getBoundingClientRect().height)
    expect(firstHeight).toBeGreaterThan(150)
  })
})

test.describe('scrape flow keeps results visible (no desktop/mobile drift)', () => {
  test('prefilled city: existing cards render immediately while the scrape is still running', async ({ page }) => {
    test.setTimeout(30_000)
    await page.setViewportSize({ width: 1280, height: 800 })
    await stubApi(page, { scrapeDelay: 8000 })
    await page.goto('/#/dashboard?city=Bandung')

    // The scrape is blocked for 8s — existing DB cards must appear right away.
    const cards = page.locator('.kos-card')
    await expect(cards.first()).toBeVisible({ timeout: 6_000 })
    await expect(cards).toHaveCount(6)

    // Background scrape is communicated via an overlay, not by hiding results.
    const overlay = page.locator('.list-overlay')
    await expect(overlay).toBeVisible()
    await expect(overlay).toContainText('Mencari data baru')

    // Once the scrape finishes, the overlay clears and cards stay.
    await expect(overlay).toHaveCount(0, { timeout: 15_000 })
    await expect(cards).toHaveCount(6)

    // Area breakdown from the scrape response is shown as chips.
    const areaBar = page.locator('.area-bar')
    await expect(areaBar).toBeVisible()
    await expect(areaBar).toContainText('4 area ditemukan')
    await expect(areaBar.locator('.area-chip')).toHaveCount(4)
    await expect(areaBar.locator('.area-chip').first()).toContainText('Coblong')
    await expect(areaBar.locator('.area-chip').first()).toContainText('16')
  })

  test('scrape fails with no existing data: shows the error state card', async ({ page }) => {
    test.setTimeout(30_000)
    await page.setViewportSize({ width: 1280, height: 800 })
    await stubApi(page, { items: [], scrapeStatus: 502 })
    await page.goto('/#/dashboard?city=Merauke')

    await expect(page.locator('.state-error')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.state-error')).toContainText('Terjadi kesalahan')
    await expect(page.locator('.state-error')).toContainText('Coba lagi')
  })

  test('scrape response without areas: no area bar rendered (backward compatible)', async ({ page }) => {
    test.setTimeout(30_000)
    await page.setViewportSize({ width: 1280, height: 800 })
    await stubApi(page, { scrapeResponse: { message: 'Scrape selesai', total_scraped: 0 } })
    await page.goto('/#/dashboard?city=Bandung')

    await expect(page.locator('.kos-card').first()).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.list-overlay')).toHaveCount(0, { timeout: 15_000 })
    await expect(page.locator('.area-bar')).toHaveCount(0)
  })

  test('scrape fails with existing data: keeps the cards and toasts the error', async ({ page }) => {
    test.setTimeout(30_000)
    await page.setViewportSize({ width: 1280, height: 800 })
    await stubApi(page, { scrapeStatus: 502 })
    await page.goto('/#/dashboard?city=Bandung')

    await expect(page.locator('.kos-card').first()).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.toast-error')).toBeVisible()
    await expect(page.locator('.toast-error')).toContainText('Gagal scrape')
    await expect(page.locator('.kos-card')).toHaveCount(6)
  })
})