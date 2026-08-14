import { test, expect } from '@playwright/test'

test('theme toggle: dark mode applied, persisted, and header icon flips', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/#/landing')
  await page.addStyleTag({ content: 'img { display: none !important; }' })

  const html = page.locator('html')
  const toggle = page.locator('.theme-toggle')

  await expect(html).toHaveAttribute('data-theme', 'light')
  await expect(toggle.locator('.icon-moon')).toBeVisible()

  await toggle.click()
  await expect(html).toHaveAttribute('data-theme', 'dark')
  await expect(toggle.locator('.icon-sun')).toBeVisible()

  const stored = await page.evaluate(() => localStorage.getItem('kos-theme'))
  expect(stored).toBe('dark')

  await page.waitForTimeout(400)
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bodyBg).toBe('rgb(11, 18, 32)')

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'dark')

  await toggle.click()
  await expect(html).toHaveAttribute('data-theme', 'light')
  await page.screenshot({ path: 'test-results/theme-light.png' })
  await toggle.click()
  await page.screenshot({ path: 'test-results/theme-dark.png' })
})
