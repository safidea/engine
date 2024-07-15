import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import App, { type App as AppConfig } from '@safidea/engine'

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
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const paragraphText = await page.textContent('p')
    expect(paragraphText).toBe(text)
  })

  test('should display the paragraph id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Paragraph',
          text: 'hello world',
          id: 'my-paragraph',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraph = page.getByText('hello world')
    await expect(paragraph).toHaveAttribute('id')
    expect(await paragraph.getAttribute('id')).toBe('my-paragraph')
  })
})
