import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'

test.describe('A home page of an invoice app', () => {
  test('should go to the /about page when click on the "about" link', async ({
    page,
    folder,
  }) => {
    // GIVEN
    const port = 50200
    await new Foundation({ port, folder })
      .config({
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
      .start()
    await page.goto(helpers.getUrl(port, '/'))

    // WHEN
    await page.click('a[href="/about"]')

    // THEN
    expect(page.url()).toContain('/about')
  })
})
