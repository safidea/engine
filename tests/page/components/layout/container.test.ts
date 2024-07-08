import { test, expect } from '@tests/fixtures'
import Page, { type Page as PageConfig } from '@safidea/engine/page'
import App, { type App as AppConfig } from '@safidea/engine'

test.describe('Container', () => {
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

  test('should render a container in app page', async ({ page }) => {
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

  test('should render the container id', async ({ page }) => {
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

  test.describe('Breakpoint', () => {
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
                    component: 'Container',
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
      await page.setViewportSize({
        width: 1800,
        height: 1200,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('1536px')
      expect(style.maxWidth).toBe('1536px')
    })

    test('should render a container with no breakpoint', async ({ page }) => {
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
                    component: 'Container',
                    breakpoint: 'none',
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
      await page.setViewportSize({
        width: 1800,
        height: 1200,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('1800px')
      expect(style.maxWidth).toBe('none')
    })

    test('should render a container with a small breakpoint', async ({ page }) => {
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
                    component: 'Container',
                    breakpoint: 'sm',
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
      await page.setViewportSize({
        width: 700,
        height: 500,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('640px')
      expect(style.maxWidth).toBe('640px')
    })

    test('should render a container with a medium breakpoint', async ({ page }) => {
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
                    component: 'Container',
                    breakpoint: 'md',
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
      await page.setViewportSize({
        width: 800,
        height: 500,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('768px')
      expect(style.maxWidth).toBe('768px')
    })

    test('should render a container with a large breakpoint', async ({ page }) => {
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
                    component: 'Container',
                    breakpoint: 'lg',
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
      await page.setViewportSize({
        width: 1200,
        height: 500,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('1024px')
      expect(style.maxWidth).toBe('1024px')
    })

    test('should render a container with a extra large breakpoint', async ({ page }) => {
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
                    component: 'Container',
                    breakpoint: 'xl',
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
      await page.setViewportSize({
        width: 1400,
        height: 900,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('1280px')
      expect(style.maxWidth).toBe('1280px')
    })

    test('should render a container with a 2 extra large breakpoint', async ({ page }) => {
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
                    component: 'Container',
                    breakpoint: '2xl',
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
      await page.setViewportSize({
        width: 1800,
        height: 1200,
      })
      await page.goto(url)

      // THEN
      const style = await page.evaluate(
        (selector) => getComputedStyle(document.querySelector(selector)!),
        'div[data-component="Container"]'
      )
      expect(style.width).toBe('1536px')
      expect(style.maxWidth).toBe('1536px')
    })
  })

  test.describe('Center', () => {})

  test.describe('Padding', () => {})
})
