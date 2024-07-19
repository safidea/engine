import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Card component', () => {
  test('should render a card', async ({ page }) => {
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
    await expect(page.getByText('First post')).toBeVisible()
    await expect(page.getByText('This is a post.')).toBeVisible()
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
  })

  test('should display the card id', async ({ page }) => {
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
              id: 'my-card',
              image: {
                src: 'https://picsum.photos/200/300',
                alt: 'First post',
              },
              title: {
                text: 'First post',
              },
              paragraph: {
                text: 'This is my first post.',
              },
              href: '/posts/1',
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
    const button = page.locator('#my-card')
    await expect(button).toBeVisible()
  })
})
