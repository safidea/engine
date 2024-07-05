import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Theme', () => {
  test.slow()

  test('should load the output css file', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
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
    await page.goto(url + '/output.css')

    // THEN
    const fileContent = await page.evaluate(() => document.body.innerText)
    expect(fileContent).toContain('tailwindcss')
  })

  test('should build the css file with a custom font', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url + '/output.css')

    // THEN
    const fileContent = await page.evaluate(() => document.body.innerText)
    expect(fileContent).toContain('"Open Sans", sans-serif')
  })

  test('should render a Paragraph with a font sans', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Paragraph"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('"Open Sans", sans-serif')
  })

  test('should render a Paragraph with a font serif', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                  font: 'serif',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
          serif: ['Merriweather'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Paragraph"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('Merriweather, serif')
  })

  test('should render a Link with a font serif', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Paragraph',
                  text: 'Hello world!',
                  font: 'serif',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
          serif: ['Merriweather'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Paragraph"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('Merriweather, serif')
  })

  test('should render a Title with a font serif', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Title',
                  text: 'Hello world!',
                  font: 'serif',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
          serif: ['Merriweather'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Title"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('Merriweather, serif')
  })

  test('should render a Markdown Paragraph with a font serif', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Markdown',
                  content: '# Hello world! \n This is a markdown text.',
                  font: 'serif',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
          serif: ['Merriweather'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Paragraph"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('Merriweather, serif')
  })

  test('should render a Markdown Title with a font serif', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Markdown',
                  content: '# Hello world! \n This is a markdown text.',
                  font: 'serif',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
          serif: ['Merriweather'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Title"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('Merriweather, serif')
  })

  test('should render a Markdown Link with a font serif', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'Theme',
      features: [
        {
          name: 'theme',
          pages: [
            {
              name: 'theme',
              path: '/',
              body: [
                {
                  component: 'Markdown',
                  content: '# Hello world! \n [This is a link.](https://example.com)',
                  font: 'serif',
                },
              ],
            },
          ],
        },
      ],
      theme: {
        fontFamily: {
          sans: ['Open Sans'],
          serif: ['Merriweather'],
        },
      },
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const fontFamily = await page.$eval('[data-component="Link"]', (element) => {
      return window.getComputedStyle(element).fontFamily
    })
    expect(fontFamily).toContain('Merriweather, serif')
  })
})
