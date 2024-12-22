import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'

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
            service: 'Http',
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
                json: '{{readRecord.record}}',
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
