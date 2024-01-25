import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe('Page component', () => {
  test('should render a title', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const config: IPage = {
      name: 'Page',
      path: '/',
      title,
      body: [],
    }

    // WHEN
    const { page: pageEngine } = createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const pageTitle = await page.title()
    expect(pageTitle).toContain(title)
  })
})
