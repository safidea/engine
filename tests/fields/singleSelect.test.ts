import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type App as Config } from '@safidea/engine'

test.describe('Single select field', () => {
  Database.each(test, (dbConfig) => {
    test('should create a record with a single select field', async ({ request }) => {
      // GIVEN
      const config: Config = {
        name: 'App',
        tables: [
          {
            name: 'cars',
            fields: [
              {
                name: 'color',
                field: 'SingleSelect',
                options: ['Red', 'Blue', 'Green'],
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
        .post(`${url}/api/table/cars`, { data: { color: 'Red' } })
        .then((res) => res.json())

      // THEN
      expect(record.color).toBe('Red')
    })

    test.skip('should not create a record with a wrong value in a single select field', async ({
      request,
    }) => {
      // GIVEN
      const config: Config = {
        name: 'App',
        tables: [
          {
            name: 'cars',
            fields: [
              {
                name: 'color',
                field: 'SingleSelect',
                options: ['Red', 'Blue', 'Green'],
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
        .post(`${url}/api/table/cars`, { data: { color: 'Red' } })
        .then((res) => res.json())

      // THEN
      expect(record.color).toBe('Red')
    })
  })
})
