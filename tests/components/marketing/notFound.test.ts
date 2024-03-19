import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@solumy/engine'

test.describe('NotFound component', () => {
  test('should render the 404 default page', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const app = new App()

    // WHEN
    const url = await app.start(config)
    await page.goto(url + '/contact')

    // THEN
    expect(await page.title()).toContain('404 not found')
    await expect(page.locator('h4', { hasText: "Something's missing." })).toBeVisible()
    await expect(
      page.locator('p', {
        hasText: "Sorry, we can't find that page. You'll find lots to explore on the home page.",
      })
    ).toBeVisible()
    await expect(page.locator('a', { hasText: 'Back to Homepage' })).toBeVisible()
  })
})
