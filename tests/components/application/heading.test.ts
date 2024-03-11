import { test, expect } from '@playwright/test'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Heading component', () => {
  test('should render a heading', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Heading',
          title: { text: 'This is a title' },
          buttons: [
            {
              label: 'Click me',
              href: '/',
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    await expect(page.getByText('This is a title')).toBeVisible()
    await expect(page.getByText('Click me')).toBeVisible()
  })

  test('should redirect when clicking on a link', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Heading',
          title: { text: 'This is a title' },
          buttons: [
            {
              label: 'Click me',
              href: 'https://example.com/',
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)
    await page.getByText('Click me').click()

    // THEN
    expect(page.url()).toBe('https://example.com/')
  })
})
