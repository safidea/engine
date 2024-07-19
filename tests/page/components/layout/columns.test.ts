import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Columns component', () => {
  test('should render 3 columns', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Columns',
              children: [
                {
                  component: 'Paragraph',
                  text: 'Column 1',
                },
                {
                  component: 'Paragraph',
                  text: 'Column 2',
                },
                {
                  component: 'Paragraph',
                  text: 'Column 3',
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
    await expect(page.getByText('Column 1')).toBeVisible()
    await expect(page.getByText('Column 2')).toBeVisible()
    await expect(page.getByText('Column 3')).toBeVisible()
  })

  test('should display the columns id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Columns',
              id: 'my-columns',
              children: [
                {
                  component: 'Paragraph',
                  text: 'Column 1',
                },
                {
                  component: 'Paragraph',
                  text: 'Column 2',
                },
                {
                  component: 'Paragraph',
                  text: 'Column 3',
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
    const button = page.locator('#my-columns')
    await expect(button).toBeVisible()
  })

  /*test.describe('Breakpoint', () => {
    test('should render a container with default breakpoint', async ({ page }) => {
      // GIVEN
      const config: AppConfig = {
        name: 'Container',
        features: [
          {
            name: 'Container',
            pages: [
              {
                name: 'Page',
                path: '/',
                body: [
                  {
                    component: 'Columns',
                    children: [],
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
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('1536px')
      expect(style.maxWidth).toBe('1536px')
    })
  })*/
})
