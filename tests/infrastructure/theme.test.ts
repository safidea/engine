import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Theme', () => {
  test.skip('should change the font', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['"Open Sans"', 'sans-serif'],
          serif: ['"Merriweather"', 'serif'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    const fontFamily = await page.$eval('[data-component="Paragraph"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })

    // THEN
    console.log(fontFamily)
    expect(fontFamily).toContain('"Open Sans", sans-serif')
  })
})
