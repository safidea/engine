import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should render a spacer', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Spacer',
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)
  const html = await page.content()

  // THEN
  expect(html).toContain('<div')
  expect(html).toContain('></div>')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a spacer with lg size', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Spacer',
            size: 'lg',
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)
  const html = await page.content()

  // THEN
  expect(html).toContain('mt-12')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display the spacer with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Spacer',
            id: 'my-spacer',
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  expect(page.locator('#my-spacer')).toBeDefined()
  expect(await page.screenshot()).toMatchSnapshot()
})
