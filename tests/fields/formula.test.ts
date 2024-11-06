import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type Config } from '@latechforce/engine'

test.describe('Formula field', () => {
  Database.each(test, (dbConfig) => {
    test('should create a record with a formula field as a number', async ({ request }) => {
      // GIVEN
      const config: Config = {
        name: 'App',
        tables: [
          {
            name: 'items',
            fields: [
              {
                name: 'price',
                field: 'Number',
              },
              {
                name: 'quantity',
                field: 'Number',
              },
              {
                name: 'total',
                field: 'Formula',
                formula: 'price * quantity',
                output: {
                  field: 'Number',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/items`, {
          data: { price: 3, quantity: 5 },
        })
        .then((res) => res.json())

      // THEN
      expect(record.total).toBe(15)
    })

    test('should create a record with a formula field as a text', async ({ request }) => {
      // GIVEN
      const config: Config = {
        name: 'App',
        tables: [
          {
            name: 'users',
            fields: [
              {
                name: 'first_name',
                field: 'SingleLineText',
              },
              {
                name: 'last_name',
                field: 'SingleLineText',
              },
              {
                name: 'full_name',
                field: 'Formula',
                formula: "first_name || ' ' || last_name",
                output: {
                  field: 'SingleLineText',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/users`, {
          data: { first_name: 'John', last_name: 'Doe' },
        })
        .then((res) => res.json())

      // THEN
      expect(record.full_name).toBe('John Doe')
    })

    test('should migrate a table with a new formula field', async ({ request }) => {
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
                name: 'message',
                field: 'Formula',
                formula: "'Hello ' || name",
                output: {
                  field: 'SingleLineText',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      await database.table('leads').create()

      // WHEN
      const url = await app.start(config)
      const { record } = await request
        .post(url + '/api/table/leads', {
          data: { name: 'John' },
        })
        .then((res) => res.json())

      // THEN
      expect(record.message).toBe('Hello John')
    })

    test('should migrate a table with an updated formula field', async ({ request }) => {
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
                name: 'message',
                field: 'Formula',
                formula: "'Hello ' || name || '!'",
                output: {
                  field: 'SingleLineText',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      await database
        .table('leads', [
          {
            name: 'message',
            type: 'TEXT',
            formula: "'Hello ' || name",
          },
        ])
        .create()

      // WHEN
      const url = await app.start(config)
      const { record } = await request
        .post(url + '/api/table/leads', {
          data: { name: 'John' },
        })
        .then((res) => res.json())

      // THEN
      expect(record.message).toBe('Hello John!')
    })

    test('should create a record with a text formula field referencing another text formula field', async ({
      request,
    }) => {
      // GIVEN
      const config: Config = {
        name: 'leads backend',
        tables: [
          {
            name: 'leads',
            fields: [
              {
                name: 'first_name',
                field: 'SingleLineText',
              },
              {
                name: 'last_name',
                field: 'SingleLineText',
              },
              {
                name: 'full_name',
                field: 'Formula',
                formula: "first_name || ' ' || last_name",
                output: {
                  field: 'SingleLineText',
                },
              },
              {
                name: 'message',
                field: 'Formula',
                formula: "'Hello ' || full_name || '!'",
                output: {
                  field: 'SingleLineText',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { record } = await request
        .post(url + '/api/table/leads', {
          data: { first_name: 'John', last_name: 'Doe' },
        })
        .then((res) => res.json())

      // THEN
      expect(record.message).toBe('Hello John Doe!')
    })

    test('should create a record with a number formula field referencing another number formula field', async ({
      request,
    }) => {
      // GIVEN
      const config: Config = {
        name: 'leads backend',
        tables: [
          {
            name: 'leads',
            fields: [
              {
                name: 'unit_price',
                field: 'Number',
              },
              {
                name: 'quantity',
                field: 'Number',
              },
              {
                name: 'total',
                field: 'Formula',
                formula: 'unit_price * quantity',
                output: {
                  field: 'Number',
                },
              },
              {
                name: 'total_with_vat',
                field: 'Formula',
                formula: 'total * 1.2',
                output: {
                  field: 'Number',
                },
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      const { record } = await request
        .post(url + '/api/table/leads', {
          data: { unit_price: 10, quantity: 5 },
        })
        .then((res) => res.json())

      // THEN
      expect(record.total_with_vat).toBe(60)
    })
  })
})
