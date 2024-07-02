import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import App, { type App as AppConfig } from '@safidea/engine'

test.describe('Card component', () => {
  test('should render a card', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Card',
          image: {
            src: 'https://via.placeholder.com/150',
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
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    await expect(page.getByText('First post')).toBeVisible()
    await expect(page.getByText('This is a post.')).toBeVisible()
  })

  test('should open a page when click on a card', async ({ page }) => {
    // GIVEN
    const config: AppConfig = {
      name: 'Card',
      features: [
        {
          name: 'Card',
          pages: [
            {
              name: 'Card',
              path: '/',
              body: [
                {
                  component: 'Card',
                  image: {
                    src: 'https://via.placeholder.com/150',
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
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Card',
          id: 'my-card',
          image: {
            src: 'https://source.unsplash.com/random',
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
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const button = page.locator('#my-card')
    await expect(button).toBeVisible()
  })
})
