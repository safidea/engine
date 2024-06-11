import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import App, { type App as AppConfig } from '@safidea/engine'

test.describe('Container component', () => {
  test('should render a container', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Container',
          children: [
            {
              component: 'Paragraph',
              text: 'Hello world',
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
    const container = page.getByText('Hello world')
    await expect(container).toBeVisible()
  })

  test('should display a container in app page', async ({ page }) => {
    // GIVEN
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'display container',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Container',
                  children: [
                    {
                      component: 'Paragraph',
                      text: 'Hello world',
                    },
                  ],
                },
              ],
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
    const container = page.getByText('Hello world')
    await expect(container).toBeVisible()
  })

  test('should display the container id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Container',
          children: [
            {
              component: 'Paragraph',
              text: 'Hello world',
              id: 'my-paragraph',
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
    const container = page.getByText('Hello world')
    await expect(container).toHaveAttribute('id')
    expect(await container.getAttribute('id')).toBe('my-paragraph')
  })
})
