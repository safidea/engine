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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const pageTitle = await page.title()
    expect(pageTitle).toContain(title)
  })

  test('should render a meta description', async ({ page }) => {
    // GIVEN
    const description = 'This is a description'
    const config: IPage = {
      name: 'Page',
      path: '/',
      metas: [
        {
          name: 'description',
          content: description,
        },
      ],
      body: [],
    }

    // WHEN
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const descriptionElement = page.locator('meta[name="description"]')
    expect(await descriptionElement.getAttribute('content')).toContain(description)
  })
})
