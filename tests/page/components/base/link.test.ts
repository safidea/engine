import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import App, { type App as AppConfig } from '@safidea/engine'

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
    const link = page.getByRole('link', { name: label })
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
          name: 'display link',
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
    const link = page.getByRole('link', { name: label })
    expect(await link.getAttribute('href')).toBe(href)
  })

  test('should display the link id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Link',
          label: 'hello world',
          href: '/',
          id: 'my-link',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const link = page.getByRole('link', { name: 'hello world' })
    await expect(link).toHaveAttribute('id')
    expect(await link.getAttribute('id')).toBe('my-link')
  })
})
