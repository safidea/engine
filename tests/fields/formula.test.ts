import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type App as Config } from '@safidea/engine'

test.describe('Formula field', () => {
  Database.each(test, (dbConfig) => {
    test('should create a record with a formula field with an number output', async ({
      request,
    }) => {
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

    test('should create a record with a formula field with an text output', async ({ request }) => {
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
  })
})
