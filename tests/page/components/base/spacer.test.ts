import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Spacer component', () => {
  test('should render a spacer', async () => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Spacer',
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

  test('should render a spacer with lg size', async () => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Spacer',
          size: 'lg',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)

    // THEN
    expect(html).toContain('mt-12')
  })

  test('should display the spacer id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Spacer',
          id: 'my-spacer',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    expect(page.locator('#my-spacer')).toBeDefined()
  })
})
