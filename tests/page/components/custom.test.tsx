import { test, expect } from '@playwright/test'
import Page, { type Config } from '@solumy/engine/page'
import { components } from '@utils/tests/components'

test.describe('Custom component', () => {
  test('should render a custom paragraph component', async ({ page }) => {
    // GIVEN
    const config: Config = {
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
    const pageEngine = new Page({ components })
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Hello world')
  })
})
