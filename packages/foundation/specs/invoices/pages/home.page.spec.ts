import { test, expect } from '../../utils/fixtures'

test.describe('A home page of an invoice app', () => {
  test('should go to the /about page when click on the "about" link', async ({
    page,
    foundation,
  }) => {
    // GIVEN
    await foundation.config({
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'link',
              label: 'About',
              path: '/about',
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
