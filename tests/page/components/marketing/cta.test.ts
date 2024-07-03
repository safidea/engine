import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

test.describe('CTA component', () => {
  test('should render a CTA', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'CTA',
          title: { text: 'This is a title' },
          paragraph: { text: 'This is a description' },
          buttons: [
            {
              label: 'Click me',
              href: '/',
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
    await expect(page.locator('[data-component="CTA"]')).toBeVisible()
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
          component: 'CTA',
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

  test('should display the cta id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'CTA',
          id: 'my-cta',
          title: { text: 'This is a title' },
          paragraph: { text: 'This is a description' },
          buttons: [
            {
              label: 'Click me',
              href: '/',
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
    const cta = page.locator('#my-cta')
    await expect(cta).toBeVisible()
  })
})
