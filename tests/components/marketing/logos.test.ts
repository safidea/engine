import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Logos component', () => {
  test('should render logos', async ({ page }) => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Logos',
              title: { text: 'This is a title' },
              images: [
                {
                  src: 'https://picsum.photos/200/300',
                  alt: 'logo-1',
                },
                {
                  src: 'https://picsum.photos/200/300',
                  alt: 'logo-2',
                },
                {
                  src: 'https://picsum.photos/200/300',
                  alt: 'logo-3',
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
    await expect(page.locator('[data-component="Logos"]')).toBeVisible()
  })

  test('should display the logos id', async ({ page }) => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Logos',
              id: 'my-logos',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              images: [
                {
                  src: 'https://picsum.photos/200/300',
                  alt: 'logo-1',
                },
                {
                  src: 'https://picsum.photos/200/300',
                  alt: 'logo-2',
                },
                {
                  src: 'https://picsum.photos/200/300',
                  alt: 'logo-3',
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
    const logos = page.locator('#my-logos')
    await expect(logos).toBeVisible()
  })
})
