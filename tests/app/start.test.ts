import { test, expect } from '@utils/tests/fixtures'
import App, { type Config } from '@solumy/engine'

test.describe('App api', () => {
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
    const app = new App()

    // WHEN
    const url = await app.start(config)

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
    const app = new App()

    // WHEN
    const errors = await app.test(config)
    const url = await app.start(config)

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
      server: { port: '3000' },
    }
    const app = new App()

    // WHEN
    const url = await app.start(config)

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
      features: [
        {
          name: 'Feature',
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
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = async () => app.test(config)

    // THEN
    await expect(call).rejects.toThrow('Table source /api/table/leads does not have a GET handler')
  })

  test('should display a config error on start', async () => {
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
        },
      ],
    }
    const app = new App()

    // WHEN
    const call = async () => app.start(config)

    // THEN
    await expect(call).rejects.toThrow('Table source /api/table/leads does not have a GET handler')
  })
})
