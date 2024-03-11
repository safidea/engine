import { test, expect } from '@playwright/test'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Header component', () => {
  test('should render a header', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Header',
          title: { text: 'This is a title' },
          links: [
            {
              label: 'Home',
              href: '/',
            },
            {
              label: 'About',
              href: '/about',
            },
            {
              label: 'Contact',
              href: '/contact',
            },
          ],
          buttons: [
            {
              label: 'Click me',
              href: '/',
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
    await expect(page.getByText('This is a title')).toBeVisible()
    await expect(page.getByText('Home')).toBeVisible()
    await expect(page.getByText('About')).toBeVisible()
    await expect(page.getByText('Contact')).toBeVisible()
    await expect(page.getByText('Click me')).toBeVisible()
  })

  test('should redirect when clicking on a link', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Header',
          title: { text: 'This is a title' },
          links: [
            {
              label: 'Home',
              href: '/',
            },
            {
              label: 'About',
              href: '/about',
            },
            {
              label: 'Contact',
              href: '/contact',
            },
          ],
          buttons: [
            {
              label: 'Click me',
              href: 'https://example.com/',
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)
    await page.getByText('Click me').click()

    // THEN
    expect(page.url()).toBe('https://example.com/')
  })
})
