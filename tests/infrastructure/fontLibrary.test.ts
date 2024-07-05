import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Font Library', () => {
  test('should load a font file', async ({ page, request }) => {
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
          sans: 'Open Sans',
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url + '/output.css')
    const fileContent = await page.evaluate(() => document.body.innerText)
    const fontUrl = fileContent.match(/url\(([^)]+)\)/)?.[1] as string
    const res = await request.get(url + fontUrl)

    // THEN
    expect(fontUrl).toContain('/fonts/Open%20Sans')
    expect(res.status()).toBe(200)
  })
})
