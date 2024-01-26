import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'
import { components } from '@tests/components'

test.describe('Custom component', () => {
  test('should render a custom paragraph component', async ({ page }) => {
    // GIVEN
    const config: IPage = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Paragraph',
          text: 'world',
        },
      ],
    }

    // WHEN
    const { page: pageEngine } = await createPage(config, { components })
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Hello world')
  })
})
