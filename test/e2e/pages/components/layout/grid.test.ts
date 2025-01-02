import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'

test('should render grid component with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Grid',
            id: 'grid',
            columns: 3,
            children: [
              {
                component: 'Title',
                text: 'Column 1',
              },
              {
                component: 'Title',
                text: 'Column 2',
              },
              {
                component: 'Title',
                text: 'Column 3',
              },
            ],
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
  await expect(page.locator('#grid')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})
