import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Footer component', () => {
  test('should render a footer', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('[data-component="Footer"]')).toBeVisible()
  })

  test('should display the footer id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const footer = page.locator('#my-footer')
    await expect(footer).toBeVisible()
  })
})
