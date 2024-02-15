import { test, expect } from '@playwright/test'
import App, { type Config } from '@solumy/engine'
import Database from '@utils/tests/database'
import Queue from '@utils/tests/queue'

test.describe('RecordCreated trigger', () => {
  test('should start an automation', async () => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
    const config: Config = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          automations: [
            {
              name: 'Send email',
              trigger: {
                event: 'RecordCreated',
                table: 'leads',
              },
              actions: [],
            },
          ],
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
      database: database.config,
    }
    const app = new App()
    await app.start(config)

    // WHEN
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

    // THEN
    const job = await queue.waitFor({ name: 'Send email', state: 'created' })
    expect(job).toBeDefined()
  })
})
