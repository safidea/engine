import { test, expect } from '@playwright/test'
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
    const html = pageEngine.getHtml(config)
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
    const paragraphText = await page.textContent('p')

    // THEN
    expect(paragraphText).toBe(text)
  })
})
