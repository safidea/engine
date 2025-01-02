import { test, expect, env, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'

test('should throw an error if config is empty', async () => {
  // GIVEN
  const config = {}
  const app = new NodeApp()

  // WHEN
  const call = () => app.start(config)

  // THEN
  await expect(call()).rejects.toThrowError("must have required property 'name'")
})

test('should start an app', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
  }
  const app = new NodeApp()

  // WHEN
  const { url } = await app.start(config)

  // THEN
  expect(url).toBeDefined()
})

test('should start an app on a dedicated PORT', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
    server: { port: '6543' },
  }
  const app = new NodeApp()

  // WHEN
  const { url } = await app.start(config)

  // THEN
  expect(url).toBe('http://localhost:6543')
})

test('should check the app running status through /health endpoint', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  const { success } = await request.get(url + '/health').then((res) => res.json())

  // THEN
  expect(success).toBe(true)
})

test('should stop an app', async ({ request }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
  }
  const app = new NodeApp()
  const startedApp = await app.start(config)

  // WHEN
  await startedApp.stop()
  const response = await request.get(startedApp.url).catch((err) => err)

  // THEN
  expect(response.message).toContain('ECONNREFUSED')
})

test('should be able to use Notion as an integration', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
    integrations: {
      notion: {
        token: env.TEST_NOTION_TOKEN,
      },
    },
  }
  const app = new NodeApp()
  const { integrations } = await app.start(config)
  const { notion } = integrations

  // WHEN
  const table = await notion.getTable(env.TEST_NOTION_TABLE_1_ID)
  const page = await table.insert({ name: 'test' })

  // THEN
  expect(page.properties.name).toBe('test')
})

Database.SQLite(test, async (dbConfig) => {
  test('should be able to use Database as a service', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      tables: [
        {
          name: 'cars',
          fields: [
            {
              name: 'name',
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { services } = await app.start(config)
    const { database } = services

    // WHEN
    const record = await database.table('cars').insert({ name: 'test' })

    // THEN
    expect(record.fields.name).toBe('test')
  })
})

test('should be able to use Logger as a service', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
  }
  const app = new NodeApp()
  const { services } = await app.start(config)
  const { logger } = services

  // WHEN
  const call = () => logger.debug('test')

  // THEN
  expect(call).not.toThrow()
})
