import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Grid component', () => {
  test('should render grid component', async ({ page }) => {
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
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('[data-component="Grid"]')).toBeVisible()
  })

  test('should display the grid id', async ({ page }) => {
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
              id: 'my-grid',
              columns: 3,
              children: [
                {
                  component: 'Paragraph',
                  text: 'Column 1',
                },
                {
                  component: 'Paragraph',
                  text: 'Column 2',
                },
                {
                  component: 'Paragraph',
                  text: 'Column 3',
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
    await expect(page.locator('#my-grid')).toBeVisible()
  })
})
