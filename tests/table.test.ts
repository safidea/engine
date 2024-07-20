import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('App with tables', () => {
  test('should get a created record when posting on table api', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    const res = await request.post(`${url}/api/table/leads`, {
      data: { name: 'John' },
    })

    // THEN
    expect(res.ok()).toBeTruthy()
    const { record } = await res.json()
    expect(record).toBeDefined()
    expect(record.id).toBeDefined()
    expect(record.name).toBe('John')
  })

  Database.each(test, (dbConfig) => {
    test('should create a record in database when posting on table api', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'leads backend',
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
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/table/leads`, {
        data: { name: 'John' },
      })

      // THEN
      const record = await database
        .table('leads')
        .read([{ field: 'name', operator: '=', value: 'John' }])
      expect(record).toBeDefined()
      expect(record!.id).toBeDefined()
      expect(record!.name).toBe('John')
    })

    test('should create a record with an id with a length of 24', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'leads backend',
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
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/table/leads`, {
        data: { name: 'John' },
      })

      // THEN
      const record = await database
        .table('leads')
        .read([{ field: 'name', operator: '=', value: 'John' }])
      expect(record).toBeDefined()
      expect(record!.id).toHaveLength(24)
    })
  })
})