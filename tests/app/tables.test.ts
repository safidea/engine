import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('App with tables', () => {
  test('should get a created record when posting on table api', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          tables: [
            {
              name: 'leads',
              fields: [
                {
                  name: 'name',
                  type: 'SingleLineText',
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

  test('should create a record in database when posting on table api', async ({ request }) => {
    // GIVEN
    const database = new Database()
    const config: Config = {
      name: 'leads backend',
      features: [
        {
          name: 'leads table',
          tables: [
            {
              name: 'leads',
              fields: [
                {
                  name: 'name',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: {
        url: database.url,
        type: 'sqlite',
      },
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
    const database = new Database()
    const config: Config = {
      name: 'leads backend',
      features: [
        {
          name: 'leads table',
          tables: [
            {
              name: 'leads',
              fields: [
                {
                  name: 'name',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: {
        url: database.url,
        type: 'sqlite',
      },
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
