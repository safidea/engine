import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('NotFound component', () => {
  test('should render the 404 default page', async ({ page }) => {
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
    await expect(page.locator('[data-component="NotFound"]')).toBeVisible()
  })
})
