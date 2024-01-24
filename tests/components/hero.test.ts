import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe.skip('Hero component', () => {
  test('should render a hero', async () => {
    // GIVEN
    const config: IPage = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Paragraph',
          text: 'text',
        },
      ],
    }

    // WHEN
    const { page, errors } = createPage(config)
    const html = page?.renderHtml()

    // THEN
    expect(errors).toHaveLength(0)
    expect(html).toContain('text')
    expect(html).toContain('<p')
  })
})
