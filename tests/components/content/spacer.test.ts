import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@safidea/engine'

test.describe('Spacer component', () => {
  test('should render a spacer', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Spacer',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    const html = await page.content()

    // THEN
    expect(html).toContain('<div')
    expect(html).toContain('></div>')
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should render a spacer with lg size', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Spacer',
              size: 'lg',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    const html = await page.content()

    // THEN
    expect(html).toContain('mt-12')
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should display the spacer with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Spacer',
              id: 'my-spacer',
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
    expect(page.locator('#my-spacer')).toBeDefined()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})
