import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Menu component', () => {
  test.skip('should render a menu', async ({ page }) => {
    // GIVEN
    const label = 'This is a menu.'
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Menu',
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
    await page.getByText(label).click()

    // THEN
    const menu = page.getByText('link 1')
    await expect(menu).toBeVisible()
    expect(await menu.getAttribute('href')).toBe('/about')
  })

  test.skip('should display the menu id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Menu',
          label: 'hello world',
          id: 'my-link',
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
    const menu = page.getByText('hello world')
    await expect(menu).toHaveAttribute('id')
    expect(await menu.getAttribute('id')).toBe('my-menu')
  })
})
