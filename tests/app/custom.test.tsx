import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import { components } from '@tests/components'

test.describe('Custom App', () => {
  test('should render a custom paragraph component', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
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
    const pageEngine = new Page({ components: { Paragraph: components.Paragraph } })
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Hello world')
  })
})
