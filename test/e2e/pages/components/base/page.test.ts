import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should render a title', async ({ page }) => {
  // GIVEN
  const title = 'This is a title'
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        head: { title },
        body: [],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const pageTitle = await page.title()
  expect(pageTitle).toContain(title)
})

test('should render a meta description', async ({ page }) => {
  // GIVEN
  const description = 'This is a description'
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        head: {
          metas: [
            {
              name: 'description',
              content: description,
            },
          ],
        },
        body: [],
      },
    ],
  }
  const app = new App()
  const url = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const descriptionElement = page.locator('meta[name="description"]')
  expect(await descriptionElement.getAttribute('content')).toContain(description)
})
