import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Grid component', () => {
  test('should render grid component', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Grid',
          columns: 3,
          children: [
            {
              component: 'Title',
              text: 'Column 1',
            },
            {
              component: 'Title',
              text: 'Column 2',
            },
            {
              component: 'Title',
              text: 'Column 3',
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    await expect(page.locator('[data-component="Grid"]')).toBeVisible()
  })

  test('should display the grid id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Grid',
          id: 'my-grid',
          columns: 3,
          children: [
            {
              component: 'Paragraph',
              text: 'Column 1',
            },
            {
              component: 'Paragraph',
              text: 'Column 2',
            },
            {
              component: 'Paragraph',
              text: 'Column 3',
            },
          ],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    await expect(page.locator('#my-grid')).toBeVisible()
  })
})
