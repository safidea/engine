import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('CTA component', () => {
  test('should render a CTA with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'CTA',
              id: 'cta',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
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
    await expect(page.locator('#cta')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should redirect when clicking on primary button', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const primaryButton = {
      label: 'Click me',
      href: 'https://example.com/',
    }
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'CTA',
              title: { text: title },
              paragraph: { text: description },
              buttons: [primaryButton],
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.click('a')

    // THEN
    expect(page.url()).toBe(primaryButton.href)
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
