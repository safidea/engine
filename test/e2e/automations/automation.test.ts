import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'

Database.each(test, (dbConfig) => {
  test('should create an automation history', async ({ request }) => {
    // GIVEN
    const database = new Database(dbConfig)
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'run',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'run',
          },
          actions: [],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { url } = await app.start(config)

    // WHEN
    await request.post(`${url}/api/automation/run`)

    // THEN
    await expect(database.waitForAutomationHistory('run')).resolves.toBeDefined()
  })
})
