import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

test.describe('Base component', () => {
  test.skip('should display the component id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Paragraph',
          text: 'hello world',
          id: 'my-paragraph',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const paragraph = page.getByRole('paragraph')
    await expect(paragraph).toBeVisible()
    await expect(paragraph).toHaveAttribute('id')
    expect(await paragraph.getAttribute('id')).toBe('my-paragraph')
  })
})
