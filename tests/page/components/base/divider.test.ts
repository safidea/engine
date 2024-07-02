import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Divider component', () => {
  test('should render a divider', async () => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Divider',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)

    // THEN
    expect(html).toContain('<div')
    expect(html).toContain('></div>')
  })

  test('should display the divider id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Divider',
          id: 'my-divider',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    expect(page.locator('#my-divider')).toBeDefined()
  })
})
