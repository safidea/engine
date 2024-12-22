import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'

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

Database.each(test, (database) => {
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
      tables: [
        {
          name: 'leads',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database,
    }
    const app = new App()

    // WHEN
    const callTest = () => app.test(config)
    const callStart = () => app.start(config)

    // THEN
    await expect(callTest()).resolves.toBeUndefined()
    await expect(callStart()).resolves.toBeDefined()
  })
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
            table: 'leads',
            fields: [
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
  await expect(call()).rejects.toThrow('Table "leads" not found')
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
            table: 'leads',
            fields: [
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
  await expect(call()).rejects.toThrow('Table "leads" not found')
})
