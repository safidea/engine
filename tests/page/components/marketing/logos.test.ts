import { test, expect } from '@tests/fixtures'
import Page, { type Page as Config } from '@safidea/engine/page'

test.describe('Logos component', () => {
  test('should render logos', async ({ page }) => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Logos',
          title: { text: 'This is a title' },
          images: [
            {
              src: 'https://picsum.photos/200/300',
              alt: 'logo-1',
            },
            {
              src: 'https://picsum.photos/200/300',
              alt: 'logo-2',
            },
            {
              src: 'https://picsum.photos/200/300',
              alt: 'logo-3',
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
    await expect(page.locator('[data-component="Logos"]')).toBeVisible()
  })

  test('should display the logos id', async ({ page }) => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Logos',
          id: 'my-logos',
          title: { text: 'This is a title' },
          paragraph: { text: 'This is a description' },
          images: [
            {
              src: 'https://picsum.photos/200/300',
              alt: 'logo-1',
            },
            {
              src: 'https://picsum.photos/200/300',
              alt: 'logo-2',
            },
            {
              src: 'https://picsum.photos/200/300',
              alt: 'logo-3',
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
    const logos = page.locator('#my-logos')
    await expect(logos).toBeVisible()
  })
})
