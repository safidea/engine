import { test, expect } from '@playwright/test'
import { createApp, type IApp } from '@solumy/engine'

test.describe('NotFound component', () => {
  test('should render the 404 default page', async ({ page }) => {
    // GIVEN
    const config: IApp = {
      name: 'App',
      features: [],
    }
    const { app } = await createApp(config)

    // WHEN
    const url = await app!.start()
    await page.goto(url)

    // THEN
    expect(await page.title()).toContain('404 not found')
    await expect(page.locator('p', { hasText: "Something's missing." })).toBeVisible()
    await expect(
      page.locator('p', {
        hasText: "Sorry, we can't find that page. You'll find lots to explore on the home page.",
      })
    ).toBeVisible()
    await expect(page.locator('a', { hasText: 'Back to Homepage' })).toBeVisible()
  })
})
