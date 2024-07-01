import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'

test.describe('Columns component', () => {
  test.skip('should render 3 columns', async ({ page }) => {
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

  test.skip('should display the columns id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Button',
          label: 'hello world',
          id: 'my-button',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const button = page.getByText('hello world')
    await expect(button).toHaveAttribute('id')
    expect(await button.getAttribute('id')).toBe('my-button')
  })
})
