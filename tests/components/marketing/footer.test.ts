import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('Footer component', () => {
  test('should render a footer with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Footer',
              id: 'footer',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              links: [
                {
                  label: 'Link 1',
                  href: '/',
                },
                {
                  label: 'Link 2',
                  href: '/',
                },
              ],
              copyright: '@ Copyright',
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
    await expect(page.locator('#footer')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
