import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'
import Queue from '@test/drivers/queue'

Database.each(test, (dbConfig) => {
  test('should start an automation when a record is created', async () => {
    // GIVEN
    const database = new Database(dbConfig)
    const queue = new Queue(database)
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'Send email',
          trigger: {
            service: 'Database',
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new App()
    await app.start(config)

    // WHEN
    await database
      .table('leads')
      .insert({ id: '1', fields: { name: 'John' }, created_at: new Date() })

    // THEN
    await expect(queue.waitForEmpty('Send email', 5000)).resolves.toBeTruthy()
  })
})
