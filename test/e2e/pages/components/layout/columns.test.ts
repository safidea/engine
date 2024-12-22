import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

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
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  await expect(page.getByText('Column 1')).toBeVisible()
  await expect(page.getByText('Column 2')).toBeVisible()
  await expect(page.getByText('Column 3')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display the columns with id', async ({ page }) => {
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
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const button = page.locator('#my-columns')
  await expect(button).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
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
      const { url } = await app.start(config)

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
