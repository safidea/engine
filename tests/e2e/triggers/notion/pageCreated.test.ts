import { test, expect, env } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import { testTable } from '@tests/integrations/notion'
import Database from '@tests/drivers/database'

test.describe('Page Created trigger', () => {
  test.slow()

  Database.SQLite(test, async (dbConfig) => {
    test('should start an automation when a Notion page is created in a table', async () => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
        automations: [
          {
            name: 'page-created',
            trigger: {
              integration: 'Notion',
              event: 'PageCreated',
              tableId: env.TEST_NOTION_TABLE_ID,
            },
            actions: [],
          },
        ],
        integrations: {
          notion: {
            token: env.TEST_NOTION_TOKEN,
          },
        },
        database: dbConfig,
      }
      const app = new App()
      await app.start(config)

      // WHEN
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await testTable.create({
        name: 'My new page',
      })

      // THEN
      await expect(database.waitForAutomationHistory('page-created')).resolves.toBeDefined()
    })
  })
})
