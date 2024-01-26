import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe('Paragraph component', () => {
  test('should render a paragraph', async ({ page }) => {
    // GIVEN
    const text = 'This is a paragraph.'
    const config: IPage = {
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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain(text)
  })
})
