import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Heading component', () => {
  test('should render a heading', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.getByText('This is a title')).toBeVisible()
    await expect(page.getByText('Click me')).toBeVisible()
  })

  test('should redirect when clicking on a link', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.getByText('Click me').click()

    // THEN
    expect(page.url()).toBe('https://example.com/')
  })

  test('should display the heading id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Heading',
              id: 'my-heading',
              title: { text: 'This is a title' },
              buttons: [
                {
                  label: 'Click me',
                  href: 'https://example.com/',
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
    const heading = page.locator('#my-heading')
    await expect(heading).toBeVisible()
  })
})
