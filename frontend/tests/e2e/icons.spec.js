import { test, expect } from '@playwright/test'

const SAMPLE = [
  { id: '1', name: 'Kos Anggrek Putih', source: 'gmaps', address: 'Jl. Sudirman No. 5, Kec. Coblong, Kota Bandung, Jawa Barat', city: 'Bandung', district: 'Kec. Coblong', latitude: -6.9075, longitude: 107.6091, rating: 4.8, total_reviews: 42, price_range: 'Mahal', photos: ['https://picsum.photos/seed/kos-1/640/360'], google_maps_url: 'https://maps.google.com' },
  { id: '2', name: 'Kos Griya Melati', source: 'osm', address: 'Jl. Dago Asri No. 12, Kec. Cidadap, Kota Bandung, Jawa Barat', city: 'Bandung', district: 'Kec. Cidadap', latitude: -6.8667, longitude: 107.6167, rating: 4.5, total_reviews: 18, price_range: 'Sedang', photos: [] },
]

async function stubApi(page) {
  await page.route('**://maps.googleapis.com/**', r => r.abort())
  await page.route('**/api/kos?**', r => r.fulfill({ json: { data: SAMPLE, total: 2 } }))
  await page.route('**/api/kos/1', r => r.fulfill({ json: { ...SAMPLE[0], id: '1', opening_hours: ['Senin: 08.00-17.00'], phone: '0812-1111-2222', website: 'https://kos.example.com' } }))
  await page.route('**/api/scrape', r => r.fulfill({ json: { message: 'ok', total_scraped: 1, areas: [{ district: 'Kec. Coblong', count: 1 }] } }))
}

async function assertIconsPaint(page) {
  const report = await page.evaluate(() =>
    [...document.querySelectorAll('.icon')].map(svg => {
      const r = svg.getBoundingClientRect()
      const painted = svg.querySelectorAll('path, rect, circle, polygon').length
      return { cls: svg.getAttribute('class'), w: r.width, h: r.height, painted }
    })
  )
  const broken = report.filter(i => i.w === 0 || i.h === 0 || i.painted === 0)
  expect(broken, `Ikon tidak ter-render: ${JSON.stringify(broken)}`).toEqual([])
}

test.describe('icon rendering & select layout across themes', () => {
  for (const theme of ['light', 'dark']) {
    test(`${theme}: all icons paint on landing, dashboard, and detail`, async ({ page }) => {
      test.setTimeout(30_000)
      await page.setViewportSize({ width: 1280, height: 900 })
      await stubApi(page)
      await page.goto('/#/')
      await page.addStyleTag({ content: 'img { display: none !important; }' })
      if (theme === 'dark') await page.click('.theme-toggle')
      await page.waitForTimeout(300)

      await assertIconsPaint(page)
      await expect(page.locator('.icon')).toHaveCount(26)

      await page.goto('/#/dashboard?city=Bandung')
      await page.waitForTimeout(600)
      await assertIconsPaint(page)

      const selects = await page.evaluate(() =>
        [...document.querySelectorAll('.select')].map(s => s.getBoundingClientRect().width)
      )
      for (const w of selects) {
        expect(w, 'select tidak boleh melebar penuh satu baris').toBeLessThan(400)
      }

      await page.goto('/#/kos/1')
      await page.waitForTimeout(600)
      await assertIconsPaint(page)
    })
  }
})
