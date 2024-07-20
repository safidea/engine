import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Features component', () => {
  test('should render features', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Features',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              features: [
                {
                  title: { text: 'Feature 1' },
                  paragraph: { text: 'Description 1' },
                  icon: { name: 'ChartBarSquare' },
                },
                {
                  title: { text: 'Feature 2' },
                  paragraph: { text: 'Description 2' },
                  icon: { name: 'Scale' },
                },
                {
                  title: { text: 'Feature 3' },
                  paragraph: { text: 'Description 3' },
                  icon: { name: 'Cog6Tooth' },
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
    await expect(page.locator('[data-component="Features"]')).toBeVisible()
  })

  test('should display the features id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Features',
              id: 'my-features',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              features: [
                {
                  title: { text: 'Feature 1' },
                  paragraph: { text: 'Description 1' },
                  icon: { name: 'ChartBarSquare' },
                },
                {
                  title: { text: 'Feature 2' },
                  paragraph: { text: 'Description 2' },
                  icon: { name: 'Scale' },
                },
                {
                  title: { text: 'Feature 3' },
                  paragraph: { text: 'Description 3' },
                  icon: { name: 'Cog6Tooth' },
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
    const features = page.locator('#my-features')
    await expect(features).toBeVisible()
  })
})
