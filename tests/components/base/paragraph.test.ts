import { test, expect } from '@playwright/test'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Paragraph component', () => {
  test('should render a paragraph', async ({ page }) => {
    // GIVEN
    const text = 'This is a paragraph.'
    const config: Config = {
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
    const pageEngine = new Page(config)
    const html = pageEngine.getHtml()
    await page.setContent(html)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain(text)
  })
})
