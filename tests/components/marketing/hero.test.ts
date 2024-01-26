import { test, expect } from '@playwright/test'
import { createPage, type IPage } from '@solumy/engine/page'

test.describe('Hero component', () => {
  test('should render a hero', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const primaryButton = {
      label: 'Click me',
      href: '/',
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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)

    // THEN
    const titleContent = await page.textContent('h1')
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
    const { page: pageEngine } = await createPage(config)
    const html = pageEngine!.renderHtml()
    await page.setContent(html!)
    await page.click('a')

    // THEN
    expect(page.url()).toBe(primaryButton.href)
  })
})
