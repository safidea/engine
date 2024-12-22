import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('Logos component', () => {
  test('should render logos with id', async ({ page }) => {
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
              id: 'logos',
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
    const { url } = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('#logos')).toBeVisible()
  })
})
