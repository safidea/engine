import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'
import { Database } from '@utils/tests/database'

test.describe('App with tables', () => {
  test('should create a row when posting on table api', async ({ request }) => {
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
    const app = new App(config)
    const url = await app.start()

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

  test('should create a row in database when posting on table api', async ({ request }) => {
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
      },
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    await request.post(`${url}/api/table/leads`, {
      data: { name: 'John' },
    })

    // THEN
    const row = await database
      .table('leads')
      .read([{ field: 'name', operator: '=', value: 'John' }])
    expect(row).toBeDefined()
    expect(row!.id).toBeDefined()
    expect(row!.name).toBe('John')
  })

  test('should create a row with an id with a length of 24', async ({ request }) => {
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
      },
    }
    const app = new App(config)
    const url = await app.start()

    // WHEN
    await request.post(`${url}/api/table/leads`, {
      data: { name: 'John' },
    })

    // THEN
    const row = await database
      .table('leads')
      .read([{ field: 'name', operator: '=', value: 'John' }])
    expect(row).toBeDefined()
    expect(row!.id).toHaveLength(24)
  })
})
