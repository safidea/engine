import { test, expect } from '@utils/tests/fixtures'
import Page, { type Config as PageConfig } from '@solumy/engine/page'
import App, { type Config as AppConfig } from '@solumy/engine'

test.describe('Paragraph component', () => {
  test('should render a paragraph', async ({ page }) => {
    // GIVEN
    const text = 'This is a paragraph.'
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Paragraph',
          text,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain(text)
  })

  test('should display a paragraph in app page', async ({ page }) => {
    // GIVEN
    const text = 'Hello world!'
    const config: AppConfig = {
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

    // THEN
    const paragraphText = await page.textContent('p')
    expect(paragraphText).toBe(text)
  })
})
