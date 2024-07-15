import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'
import Queue from '@tests/queue'

test.describe('RecordCreated trigger', () => {
  test('should start an automation', async () => {
    // GIVEN
    const database = new Database()
    const queue = new Queue(database)
    const config: Config = {
      name: 'App',
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
