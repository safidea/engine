import { test, expect } from '@tests/fixtures'
import Database from '@tests/database'
import App, { type App as Config } from '@safidea/engine'

test.describe('Rollup field', () => {
  Database.each(test, (dbConfig) => {
    test('should create a record with a rollup field as a number', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
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
          {
            name: 'invoices',
            fields: [
              {
                name: 'items',
                field: 'MultipleLinkedRecord',
                table: 'items',
              },
              {
                name: 'total',
                field: 'Rollup',
                multipleLinkedRecord: 'items',
                linkedRecordField: 'total',
                formula: 'SUM(values)',
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
      await database
        .table('items', [
          { name: 'price', type: 'NUMERIC' },
          { name: 'quantity', type: 'NUMERIC' },
        ])
        .insertMany([
          { id: '1', price: 3, quantity: 5, created_at: new Date() },
          { id: '2', price: 5, quantity: 2, created_at: new Date() },
        ])

      // WHEN
      const { record } = await request
        .post(`${url}/api/table/invoices`, {
          data: { items: ['1', '2'] },
        })
        .then((res) => res.json())

      // THEN
      expect(record.total).toBe(25)
    })
  })
})
