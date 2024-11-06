import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('NotFound component', () => {
  test('should render the 404 default page with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Home',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const url = await app.start(config)
    await page.goto(url + '/contact')

    // THEN
    await expect(page.locator('#not-found')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
