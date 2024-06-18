import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('App with pages', () => {
  test('should display a paragraph in app page', async ({ page }) => {
    // GIVEN
    const text = 'Hello world!'
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'display paragraph',
          pages: [
            {
              name: 'paragraph',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text,
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
    const paragraphText = await page.textContent('p')

    // THEN
    expect(paragraphText).toBe(text)
  })

  test('should display a title in a production env', async ({ page }) => {
    // GIVEN
    const text = 'Hello world!'
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'display title',
          pages: [
            {
              name: 'home',
              path: '/',
              body: [
                {
                  component: 'Title',
                  text,
                },
              ],
            },
          ],
        },
      ],
      server: {
        env: 'production',
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const title = await page.textContent('h4')
    expect(title).toBe(text)
  })

  test('should display a page favicon', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'display title',
          pages: [
            {
              name: 'home',
              path: '/',
              head: {
                links: [
                  {
                    rel: 'icon',
                    href: '/favicon.ico',
                    type: 'image/x-icon',
                  },
                ],
              },
              body: [],
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
    const content = await page.content()
    expect(content).toContain('<link rel="icon" href="/favicon.ico')
    expect(content).toContain('" type="image/x-icon">')
  })
})
