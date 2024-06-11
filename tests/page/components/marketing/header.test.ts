import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

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

  test('should render a header with a dropdown', async ({ page }) => {
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
              links: [
                {
                  label: 'Our culture',
                  href: '/our-culture',
                },
                {
                  label: 'Our team',
                  href: '/our-team',
                },
              ],
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
    await page.getByText('About').hover()

    // THEN
    const menu = page.getByRole('link', { name: 'Our culture' })
    await expect(menu).toBeVisible()
    expect(await menu.getAttribute('href')).toBe('/our-culture')
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

  test('should display the header id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Header',
          id: 'my-header',
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

    // THEN
    const header = page.locator('#my-header')
    await expect(header).toBeVisible()
  })
})
