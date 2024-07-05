import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Font Library', () => {
  test.skip('should load a custom font', async ({ page }) => {
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
          sans: ['Open Sans'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url + '/fonts/OpenSans.css')

    // THEN
    const fileContent = await page.evaluate(() => document.body.innerText)
    expect(fileContent).toContain('OpenSans')
  })
})
