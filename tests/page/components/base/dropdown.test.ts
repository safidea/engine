import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Dropdown component', () => {
  test('should render a dropdown', async ({ page }) => {
    // GIVEN
    const label = 'This is a dropdown.'
    const config: PageConfig = {
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
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)
    await page.getByText(label).hover()

    // THEN
    const menu = page.getByRole('link', { name: 'link 1' })
    await expect(menu).toBeVisible()
    expect(await menu.getAttribute('href')).toBe('/about')
  })

  test('should display the dropdown id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
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
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const menu = page.locator('#my-dropdown')
    await expect(menu).toBeVisible()
  })
})
