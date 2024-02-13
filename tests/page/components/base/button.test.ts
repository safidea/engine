import { test, expect } from '@playwright/test'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Button component', () => {
  test('should render a button', async ({ page }) => {
    // GIVEN
    const label = 'Button'
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Button',
          label,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const buttonContent = await page.textContent('button')
    expect(buttonContent).toContain(label)
  })

  test('should render a button with a link', async ({ page }) => {
    // GIVEN
    const label = 'Button'
    const href = 'https://example.com/'
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Button',
          label,
          href,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const button = page.locator('a', { hasText: label })
    expect(await button.getAttribute('href')).toContain(href)
  })
})
