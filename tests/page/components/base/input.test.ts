import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import App, { type App as AppConfig } from '@safidea/engine'

test.describe('Input component', () => {
  test('should render a textarea input', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Container',
          children: [
            {
              component: 'Input',
              type: 'textarea',
              name: 'description',
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
    const input = page.getByRole('textbox')
    await expect(input).toBeVisible()
    const isTextarea = await input.evaluate((node) => node.tagName.toLowerCase() === 'textarea')
    expect(isTextarea).toBeTruthy()
  })

  test('should display a input in app page', async ({ page }) => {
    // GIVEN
    const config: AppConfig = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Input',
              name: 'name',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const input = page.getByRole('textbox')
    await expect(input).toBeVisible()
  })

  test('should display the input id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Input',
          name: 'name',
          id: 'my-input',
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const input = page.getByRole('textbox')
    await expect(input).toHaveAttribute('id')
    expect(await input.getAttribute('id')).toBe('my-input')
  })
})
