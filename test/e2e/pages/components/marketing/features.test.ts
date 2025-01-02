import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'

test.describe('Features component', () => {
  test('should render features with id', async ({ page }) => {
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
              id: 'features',
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
    const app = new NodeApp()
    const { url } = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('#features')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
