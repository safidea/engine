import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'

test.describe.only('App', () => {
  test('should start an app', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const app = new App(config)
    await app.start()

    // WHEN
    const url = await app.start()

    // THEN
    expect(url).toBeDefined()
  })

  test('should start an app after testing specs', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          specs: [
            {
              name: 'display invalid text',
              when: [{ open: '/' }],
              then: [{ text: 'Hello world!' }],
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
        },
      ],
    }
    const app = new App(config)

    // WHEN
    const url = await app.start()
    const errors = await app.test()

    // THEN
    expect(errors).toHaveLength(0)
    expect(url).toBeDefined()
  })

  test('should start an app on a dedicated PORT', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const app = new App(config, { port: 3000 })

    // WHEN
    const url = await app.start()

    // THEN
    expect(url).toBe('http://localhost:3000')
  })

  test('should check the app running status through /health endpoint', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    const { success } = await request.get(url + '/health').then((res) => res.json())

    // THEN
    expect(success).toBe(true)
  })

  test('should stop an app', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    await app!.stop()
    const response = await request.get(url).catch((err) => err)

    // THEN
    expect(response.message).toContain('ECONNREFUSED')
  })
})
