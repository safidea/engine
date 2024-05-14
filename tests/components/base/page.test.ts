import { test, expect } from '@tests/fixtures'
import Page, { type Config } from '@safidea/engine/page'

test.describe('Page component', () => {
  test('should render a title', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const config: Config = {
      name: 'Page',
      path: '/',
      head: { title },
      body: [],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const pageTitle = await page.title()
    expect(pageTitle).toContain(title)
  })

  test('should render a meta description', async ({ page }) => {
    // GIVEN
    const description = 'This is a description'
    const config: Config = {
      name: 'Page',
      path: '/',
      head: {
        metas: [
          {
            name: 'description',
            content: description,
          },
        ],
      },
      body: [],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const descriptionElement = page.locator('meta[name="description"]')
    expect(await descriptionElement.getAttribute('content')).toContain(description)
  })
})
