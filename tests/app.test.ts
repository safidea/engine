import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import { components } from '@tests/dist/components'

test.describe('App', () => {
  test('should throw an error if config is empty', async () => {
    // GIVEN
    const config = {}
    const app = new App()

    // WHEN
    const call = () => app.start(config)

    // THEN
    await expect(call()).rejects.toThrowError("must have required property 'name'")
  })

  test('should start an app', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const url = await app.start(config)

    // THEN
    expect(url).toBeDefined()
  })

  test('should start an app after testing tests', async () => {
    test.slow()

    // GIVEN
    const config: Config = {
      name: 'App',
      tests: [
        {
          name: 'display invalid text',
          when: [{ event: 'Open', url: '/' }],
          then: [{ expect: 'Text', text: 'Hello world!' }],
        },
      ],
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = () => app.test(config)
    const url = await app.start(config)

    // THEN
    await expect(call()).resolves.toBeUndefined()
    expect(url).toBeDefined()
  })

  test('should start an app on a dedicated PORT', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
      server: { port: '6543' },
    }
    const app = new App()

    // WHEN
    const url = await app.start(config)

    // THEN
    expect(url).toBe('http://localhost:6543')
  })

  test('should check the app running status through /health endpoint', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const { success } = await request.get(url + '/health').then((res) => res.json())

    // THEN
    expect(success).toBe(true)
  })

  test('should stop an app', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await app.stop()
    const response = await request.get(url).catch((err) => err)

    // THEN
    expect(response.message).toContain('ECONNREFUSED')
  })

  test('should replace env variables in the config', async () => {
    // GIVEN
    process.env.PORT = '5432'
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'Hello world!',
            },
          ],
        },
      ],
      server: { port: '$PORT' },
    }
    const app = new App()

    // WHEN
    const url = await app.start(config)

    // THEN
    expect(url).toContain('5432')
  })

  test('should display a config error on test', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Table',
              source: '/api/table/leads',
              columns: [
                {
                  name: 'name',
                  label: 'Name',
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = async () => app.test(config)

    // THEN
    await expect(call()).rejects.toThrow(
      'Table source /api/table/leads does not have a GET handler'
    )
  })

  test('should display a config error on start', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Table',
              source: '/api/table/leads',
              columns: [
                {
                  name: 'name',
                  label: 'Name',
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = async () => app.start(config)

    // THEN
    await expect(call()).rejects.toThrow(
      'Table source /api/table/leads does not have a GET handler'
    )
  })

  test('should render a custom paragraph component', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Paragraph',
              text: 'world',
            },
          ],
        },
      ],
    }
    const app = new App({ components: { Paragraph: components.Paragraph } })
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Hello world')
  })
})
