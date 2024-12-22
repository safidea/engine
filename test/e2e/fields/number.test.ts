import { test, expect } from '@test/fixtures'
import Database from '@test/drivers/database'
import App, { type Config } from '@latechforce/engine'

test.describe('Number field', () => {
  Database.each(test, (dbConfig) => {
    test('should create a record with a number field', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        tables: [
          {
            name: 'scores',
            fields: [
              {
                name: 'score',
                field: 'Number',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)

      // WHEN
      await request.post(`${url}/api/table/scores`, { data: { score: 3 } })

      // THEN
      const record = await database
        .table('scores', [{ name: 'score', type: 'NUMERIC' }])
        .read({ field: 'score', operator: 'Equals', value: 3 })
      expect(record?.score).toBe(3)
    })
  })
})
