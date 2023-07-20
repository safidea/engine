import { test, expect } from '../fixtures'

test.describe('A home page of an invoice app', () => {
  test('should go to the /about page when click on the "about" link', async ({ page, app }) => {
    // GIVEN
    await app.start({
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'link',
              text: 'About',
              href: '/about',
            },
          ],
        },
        {
          path: '/about',
          title: 'About',
          components: [],
        },
      ],
    })
    await page.goto('/')

    // WHEN
    await page.click('a[href="/about"]')

    // THEN
    expect(page.url()).toContain('/about')
  })
})
