import { test, expect } from '@playwright/test'
import Page, { type Config } from '@solumy/engine/page'

test.describe('Footer component', () => {
  test('should render a footer', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const links = [
      {
        label: 'Link 1',
        href: '/',
      },
      {
        label: 'Link 2',
        href: '/',
      },
    ]
    const copyright = '@ Copyright'
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Footer',
          title,
          description,
          links,
          copyright,
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const titleLocator = page.locator('a', { hasText: title })
    await expect(titleLocator).toBeVisible()

    const descriptionLocator = page.locator('p', { hasText: description })
    await expect(descriptionLocator).toBeVisible()

    const copyrightLocator = page.locator('span', { hasText: copyright })
    await expect(copyrightLocator).toBeVisible()

    for (const link of links) {
      const linkLocator = page.locator('a', { hasText: link.label })
      await expect(linkLocator).toBeVisible()
      expect(await linkLocator.getAttribute('href')).toContain(link.href)
    }
  })
})
