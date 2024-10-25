import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Read record action', () => {
  Database.each(test, (dbConfig) => {
    test('should read a record in database', async ({ request }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'readRecord',
            trigger: {
              event: 'ApiCalled',
              path: 'read-record',
              input: {
                type: 'object',
                properties: {
                  recordId: {
                    type: 'string',
                  },
                },
              },
              output: {
                record: {
                  value: '{{readRecord.record}}',
                  type: 'object',
                },
              },
            },
            actions: [
              {
                service: 'Database',
                action: 'ReadRecord',
                name: 'readRecord',
                table: 'records',
                id: '{{trigger.body.recordId}}',
              },
            ],
          },
        ],
        tables: [
          {
            name: 'records',
            fields: [],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)
      await database.table('records').insert({ id: '1', created_at: new Date() })

      // WHEN
      const response = await request
        .post(`${url}/api/automation/read-record`, {
          data: { recordId: '1' },
        })
        .then((res) => res.json())

      // THEN
      expect(response.record.id).toBe('1')
    })
  })
})
