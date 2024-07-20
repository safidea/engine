import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Dropdown component', () => {
  test.skip('should render a dropdown', async ({ page }) => {
    // GIVEN
    const label = 'This is a dropdown.'
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Dropdown',
              label,
              links: [
                {
                  label: 'link 1',
                  href: '/about',
                },
                {
                  label: 'link 2',
                  href: '/about',
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
    await page.getByText(label).hover()

    // THEN
    const menu = page.getByRole('link', { name: 'link 1' })
    await expect(menu).toBeVisible()
    expect(await menu.getAttribute('href')).toBe('/about')
  })

  test('should display the dropdown id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Dropdown',
              label: 'hello world',
              id: 'my-dropdown',
              links: [
                {
                  label: 'link 1',
                  href: '/about',
                },
                {
                  label: 'link 2',
                  href: '/about',
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
    const menu = page.locator('#my-dropdown')
    await expect(menu).toBeVisible()
  })
})
