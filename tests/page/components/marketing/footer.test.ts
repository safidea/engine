import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

test.describe('Footer component', () => {
  test('should render a footer', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Footer',
          title: { text: 'This is a title' },
          paragraph: { text: 'This is a description' },
          links: [
            {
              label: 'Link 1',
              href: '/',
            },
            {
              label: 'Link 2',
              href: '/',
            },
          ],
          copyright: '@ Copyright',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    await expect(page.locator('[data-component="Footer"]')).toBeVisible()
  })

  test('should display the footer id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Footer',
          id: 'my-footer',
          title: { text: 'This is a title' },
          paragraph: { text: 'This is a description' },
          links: [
            {
              label: 'Link 1',
              href: '/',
            },
            {
              label: 'Link 2',
              href: '/',
            },
          ],
          copyright: 'Copyright',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const footer = page.locator('#my-footer')
    await expect(footer).toBeVisible()
  })
})
