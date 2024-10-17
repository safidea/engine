import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@safidea/engine'

test.describe('Container', () => {
  test('should render a container', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const container = page.getByText('Hello world')
    await expect(container).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should render a container in app page', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const container = page.getByText('Hello world')
    await expect(container).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should render the container with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
                  id: 'my-paragraph',
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
    await expect(container).toHaveAttribute('id')
    expect(await container.getAttribute('id')).toBe('my-paragraph')
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test.describe('Breakpoint', () => {
    test('should render a container with default breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('1536px')
      expect(style.maxWidth).toBe('1536px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with no breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                breakpoint: 'none',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('1800px')
      expect(style.maxWidth).toBe('none')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a small breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                breakpoint: 'sm',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('640px')
      expect(style.maxWidth).toBe('640px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a medium breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                breakpoint: 'md',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('768px')
      expect(style.maxWidth).toBe('768px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a large breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                breakpoint: 'lg',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('1024px')
      expect(style.maxWidth).toBe('1024px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a extra large breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                breakpoint: 'xl',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('1280px')
      expect(style.maxWidth).toBe('1280px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a 2 extra large breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                breakpoint: '2xl',
                children: [],
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
        '#container'
      )
      expect(style.width).toBe('1536px')
      expect(style.maxWidth).toBe('1536px')
      expect(await page.screenshot()).toMatchSnapshot()
    })
  })

  test.describe('Center', () => {
    test('should render a non centered container', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('0px')
      expect(style.marginRight).toBe('0px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a centered container', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                center: true,
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('132px')
      expect(style.marginRight).toBe('132px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a small breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                center: true,
                breakpoint: 'sm',
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('30px')
      expect(style.marginRight).toBe('30px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a medium breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                center: true,
                breakpoint: 'md',
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('16px')
      expect(style.marginRight).toBe('16px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a large breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                center: true,
                breakpoint: 'lg',
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('88px')
      expect(style.marginRight).toBe('88px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a extra large breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                center: true,
                breakpoint: 'xl',
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('60px')
      expect(style.marginRight).toBe('60px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with a 2 extra large breakpoint', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                center: true,
                breakpoint: '2xl',
                children: [],
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
        '#container'
      )
      expect(style.marginLeft).toBe('132px')
      expect(style.marginRight).toBe('132px')
      expect(await page.screenshot()).toMatchSnapshot()
    })
  })

  test.describe('Padding', () => {
    test('should render a container without horizontal padding', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                children: [],
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
        '#container'
      )
      expect(style.paddingLeft).toBe('0px')
      expect(style.paddingRight).toBe('0px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with horizontal padding of 4', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                padding: '4',
                children: [],
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
        '#container'
      )
      expect(style.paddingLeft).toBe('16px')
      expect(style.paddingRight).toBe('16px')
      expect(await page.screenshot()).toMatchSnapshot()
    })

    test('should render a container with horizontal padding of 20', async ({ page }) => {
      // GIVEN
      const config: Config = {
        name: 'Container',
        pages: [
          {
            name: 'Page',
            path: '/',
            body: [
              {
                component: 'Container',
                id: 'container',
                padding: '20',
                children: [],
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
        '#container'
      )
      expect(style.paddingLeft).toBe('80px')
      expect(style.paddingRight).toBe('80px')
      expect(await page.screenshot()).toMatchSnapshot()
    })
  })
})
