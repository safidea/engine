import { test, expect } from '@playwright/test'
import Page, { type Config as PageConfig } from '@solumy/engine/page'
import App, { type Config as AppConfig } from '@solumy/engine'

test.describe('Link component', () => {
  test('should render a link', async ({ page }) => {
    // GIVEN
    const label = 'This is a link.'
    const href = '/about'
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Link',
          label,
          href,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const link = page.getByText(label)
    expect(await link.getAttribute('href')).toBe(href)
  })

  test('should display a link in app page', async ({ page }) => {
    // GIVEN
    const label = 'Hello world!'
    const href = '/about'
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'display paragraph',
          pages: [
            {
              name: 'link',
              path: '/',
              body: [
                {
                  component: 'Link',
                  label,
                  href,
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const link = page.getByText(label)
    expect(await link.getAttribute('href')).toBe(href)
  })
})
