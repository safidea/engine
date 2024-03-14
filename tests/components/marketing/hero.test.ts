import { test, expect } from '@utils/tests/fixtures'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Hero component', () => {
  test('should render a hero', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const primaryButton = {
      label: 'Click me',
      href: '/',
    }
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Hero',
          title: { text: title },
          paragraph: { text: description },
          buttons: [primaryButton],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const titleContent = await page.textContent('h2')
    expect(titleContent).toContain(title)

    const descriptionContent = await page.textContent('p')
    expect(descriptionContent).toContain(description)

    const buttonContent = await page.textContent('a')
    expect(buttonContent).toContain(primaryButton.label)
  })

  test('should redirect when clicking on primary button', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const primaryButton = {
      label: 'Click me',
      href: 'https://example.com/',
    }
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Hero',
          title: { text: title },
          paragraph: { text: description },
          buttons: [primaryButton],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)
    await page.click('a')

    // THEN
    expect(page.url()).toBe(primaryButton.href)
  })
})
