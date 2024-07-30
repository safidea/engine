import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type App as Config } from '@safidea/engine'

test.describe('Single linked record field', () => {
  Database.each(test, (dbConfig) => {
    test('should create a record with a single linked record field', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
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
              {
                name: 'model',
                field: 'SingleLinkedRecord',
                table: 'models',
              },
            ],
          },
          {
            name: 'models',
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
      await database.table('models').insert({ id: '1', name: 'Model 3', created_at: new Date() })

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/cars`, { data: { name: 'Coccinelle', model: '1' } })
        .then((res) => res.json())

      // THEN
      expect(record.model).toBe('1')
    })

    test('should not create a record with a bad single linked record id', async ({
      request,
    }) => {
      // GIVEN
      const database = new Database(dbConfig)
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
              {
                name: 'model',
                field: 'SingleLinkedRecord',
                table: 'models',
              },
            ],
          },
          {
            name: 'models',
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
      await database.table('models').insert({ id: '1', name: 'Model 3', created_at: new Date() })

      // WHEN
      const { error } = await request
        .post(`${url}/api/table/cars`, { data: { name: 'Coccinelle', model: '2' } })
        .then((res) => res.json())

      // THEN
      expect(error).toStrictEqual({
        message:
          dbConfig.type === 'sqlite'
            ? 'Key is not present in table.'
            : 'Key (model)=(2) is not present in table "models".',
      })
    })
  })
})
