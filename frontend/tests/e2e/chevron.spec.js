import { test, expect } from '@playwright/test'

test('select chevron & focus follow the active theme', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.route('**://maps.googleapis.com/**', r => r.abort())
  await page.route('**/api/kos?**', r => r.fulfill({ json: { data: [], total: 0 } }))
  await page.goto('/dashboard')
  await page.waitForSelector('html[data-theme]')

  const chevron = async () => page.evaluate(() => {
    const s = document.querySelector('.select')
    return getComputedStyle(s).backgroundImage
  })

  const light = await chevron()
  expect(light).toContain('%2364748b')

  await page.click('.theme-toggle')
  await page.waitForTimeout(250)
  const dark = await chevron()
  expect(dark).toContain('%238ea0ba')
  expect(dark).not.toBe(light)
})