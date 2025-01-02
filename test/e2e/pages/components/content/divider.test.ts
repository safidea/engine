import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'

test('should render a divider with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Divider',
            id: 'divider',
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
  await expect(page.locator('#divider')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})
