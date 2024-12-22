import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test.describe('Card component', () => {
  test('should render a card with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Card',
              id: 'my-card',
              title: {
                text: 'First post',
              },
              paragraph: {
                text: 'This is a post.',
              },
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
    await expect(page.locator('#my-card')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should render a card with image', async ({ page }) => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Card',
              image: {
                src: 'https://picsum.photos/200/300',
                alt: 'First post',
              },
              title: {
                text: 'First post',
              },
              paragraph: {
                text: 'This is a post.',
              },
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
    await expect(page.getByAltText('First post')).toBeVisible()
  })

  test('should open a page when click on a card', async ({ page }) => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'Card',
      pages: [
        {
          name: 'Card',
          path: '/',
          body: [
            {
              component: 'Card',
              image: {
                src: 'https://picsum.photos/200/300',
                alt: 'First post',
              },
              title: {
                text: 'First post',
              },
              paragraph: {
                text: 'This is a post.',
              },
              href: 'https://example.com',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.click('a')

    // THEN
    await expect(page.waitForURL('https://example.com')).resolves.toBeUndefined()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
