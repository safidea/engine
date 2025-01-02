import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should load a font file', async ({ page, request }) => {
  // GIVEN
  const config: Config = {
    name: 'Theme',
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
    theme: {
      fontFamily: {
        sans: 'Open Sans',
      },
    },
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url + '/output.css')
  const fileContent = await page.evaluate(() => document.body.innerText)
  const fontUrl = fileContent.match(/url\(([^)]+)\)/)?.[1] as string
  const res = await request.get(url + fontUrl)

  // THEN
  expect(fontUrl).toContain('/fonts/Open%20Sans')
  expect(res.status()).toBe(200)
})
