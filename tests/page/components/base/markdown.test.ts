import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Markdown component', () => {
  test('should render a markdown content', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Markdown',
          content: '# This is a markdown content.',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraphContent = await page.textContent('h1')
    expect(paragraphContent).toContain('This is a markdown content.')
  })

  test.skip('should render a markdown with a Title component', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Markdown',
          content: '# This is a title.',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const title = page.getByText('This is a title.')
    expect(await title.getAttribute('data-component')).toBe('Title')
  })

  test('should display the markdown id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Markdown',
          content: '# hello world',
          id: 'my-markdown',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    expect(page.locator('#my-markdown')).toBeDefined()
  })
})
