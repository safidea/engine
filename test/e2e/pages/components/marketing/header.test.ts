import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('Header component', () => {
  test('should render a header', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const { url } = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.getByText('This is a title')).toBeVisible()
    await expect(page.getByText('Home')).toBeVisible()
    await expect(page.getByText('About')).toBeVisible()
    await expect(page.getByText('Contact')).toBeVisible()
    await expect(page.getByText('Click me')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test.skip('should render a header with a dropdown', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const { url } = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.getByText('About').hover()

    // THEN
    const menu = page.getByRole('link', { name: 'Our culture' })
    await expect(menu).toBeVisible()
    expect(await menu.getAttribute('href')).toBe('/our-culture')
  })

  test('should redirect when clicking on a link', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
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
        },
      ],
    }
    const app = new App()
    const { url } = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.getByText('Click me').click()

    // THEN
    expect(page.url()).toBe('https://example.com/')
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
