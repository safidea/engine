import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@solumy/engine'

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

  test.skip('should display a title in a production env', async ({ page }) => {
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
    const title = await page.textContent('p')
    expect(title).toBe(text)
  })
})
