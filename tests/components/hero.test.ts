import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe('Hero component', () => {
  test('should render a hero', async () => {
    // GIVEN
    const title = 'This is a title'
    const description =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit.'
    const primaryButton = {
      text: 'Click me',
      path: '/',
    }
    const config: IPage = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Hero',
          title,
          description,
          primaryButton,
        },
      ],
    }

    // WHEN
    const { page, errors } = createPage(config)
    const html = page?.renderHtml()

    // THEN
    expect(errors).toHaveLength(0)
    expect(html).toContain(title)
    expect(html).toContain('<h1')
    expect(html).toContain(description)
    expect(html).toContain('<p')
    expect(html).toContain(primaryButton.text)
    expect(html).toContain('<a')
    expect(html).toContain(`href="${primaryButton.path}"`)
  })
})
