import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Columns component', () => {
  test('should render 3 columns', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Columns',
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
    await expect(page.getByText('Column 1')).toBeVisible()
    await expect(page.getByText('Column 2')).toBeVisible()
    await expect(page.getByText('Column 3')).toBeVisible()
  })

  test('should display the columns id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Columns',
          id: 'my-columns',
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
    const button = page.locator('#my-columns')
    await expect(button).toBeVisible()
  })
})
