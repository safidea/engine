import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@tests/drivers/database'

test.describe('App with tables', () => {
  Database.each(test, (dbConfig) => {
    test('should start an app with a new table', async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'Database',
        tables: [
          {
            name: 'users',
            fields: [
              {
                name: 'email',
                field: 'SingleLineText',
              },
              {
                name: 'password',
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }

      // WHEN
      const app = new App()
      await app.start(config)

      // THEN
      await expect(database.table('users').exists()).resolves.toBe(true)
    })

    test('should start an app with a existing table', async () => {
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
      await database.table('leads').create()

      // WHEN
      const call = () => app.start(config)

      // THEN
      await expect(call()).resolves.toBeDefined()
    })

    test('should migrate a table with a new field', async () => {
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
              {
                name: 'email',
                field: 'Email',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      await database.table('leads', [{ name: 'email', type: 'TEXT' }]).create()

      // WHEN
      const call = () => app.start(config)

      // THEN
      await expect(call()).resolves.toBeDefined()
    })

    test('should migrate a table with a renamed field', async () => {
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
              {
                name: 'email',
                field: 'Email',
                onMigration: {
                  replace: 'email_address',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const leads = database.table('leads', [{ name: 'email_address', type: 'TEXT' }])
      await leads.create()
      await leads.insert({
        id: '1',
        name: 'test',
        email_address: 'test@test.com',
        created_at: new Date(),
      })

      // WHEN
      await app.start(config)

      // THEN
      const lead = await database.table('leads', [{ name: 'email', type: 'TEXT' }]).readById('1')
      expect(lead?.email).toBe('test@test.com')
      expect(lead?.email_address).toBeUndefined()
    })

    test('should migrate a table with a renamed field that has already be renamed', async () => {
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
              {
                name: 'email',
                field: 'Email',
                onMigration: {
                  replace: 'email_address',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const leads = database.table('leads', [{ name: 'email', type: 'TEXT' }])
      await leads.create()
      await leads.insert({
        id: '1',
        name: 'test',
        email: 'test@test.com',
        created_at: new Date(),
      })

      // WHEN
      const call = () => app.start(config)

      // THEN
      await expect(call()).resolves.not.toThrow()
    })

    test('should migrate a table with existing records', async () => {
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
              {
                name: 'email',
                field: 'Email',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      await app.start(config)
      const leads = database.table('leads', [{ name: 'email', type: 'TEXT' }])
      await leads.insertMany([
        { id: '1', name: 'John', created_at: new Date() },
        { id: '2', name: 'Paul', created_at: new Date() },
        { id: '3', name: 'Ringo', created_at: new Date() },
      ])
      const newConfig: Config = {
        name: 'leads backend',
        tables: [
          {
            name: 'leads',
            fields: [
              {
                name: 'name',
                field: 'SingleLineText',
              },
              {
                name: 'email',
                field: 'Email',
              },
            ],
          },
        ],
        database: dbConfig,
      }

      // WHEN
      await app.start(newConfig)

      // THEN
      const records = await leads.list([])
      expect(records).toHaveLength(3)
      expect(records[0].email).toBeNull()
      expect(records[0].name).toBe('John')
    })

    test('should return an error if table does not exist', async ({ request }) => {
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
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const res = await request.post(`${url}/api/table/unknown`, {
        data: { name: 'John' },
      })

      // THEN
      expect(res.ok()).toBeFalsy()
      const { error } = await res.json()
      expect(error).toBe('Table "unknown" not found')
    })

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

    test('should create a record with a date field', async ({ request }) => {
      // GIVEN
      const config: Config = {
        name: 'leads backend',
        tables: [
          {
            name: 'leads',
            fields: [
              {
                name: 'today',
                field: 'DateTime',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)
      const today = new Date().toISOString()

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/leads`, {
          data: { today },
        })
        .then((res) => res.json())

      // THEN
      expect(record?.today).toBe(today)
    })
  })
})
