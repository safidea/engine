import { test, expect, env } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import { testTable } from '@test/integration/notion'
import Database from '@test/drivers/database'

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
            table: env.TEST_NOTION_TABLE_1_ID,
          },
          actions: [],
        },
      ],
      integrations: {
        notion: {
          token: env.TEST_NOTION_TOKEN,
          pollingInterval: 5,
        },
      },
      database: dbConfig,
    }
    const app = new App()
    await app.start(config)

    // WHEN
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const { id } = await testTable.create({
      name: 'My new page',
    })

    // THEN
    await expect(
      database.waitForAutomationHistory('page-created', {
        field: 'trigger_data',
        operator: 'Contains',
        value: id,
      })
    ).resolves.toBeDefined()
  })

  test('should return a date property of the created page', async () => {
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
            table: env.TEST_NOTION_TABLE_1_ID,
          },
          actions: [],
        },
      ],
      integrations: {
        notion: {
          token: env.TEST_NOTION_TOKEN,
          pollingInterval: 5,
        },
      },
      database: dbConfig,
    }
    const app = new App()
    await app.start(config)

    // WHEN
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const { id } = await testTable.create({
      name: 'My new page',
    })

    // THEN
    const history = await database.waitForAutomationHistory('page-created', {
      field: 'trigger_data',
      operator: 'Contains',
      value: id,
    })
    const triggerData = JSON.parse(String(history.fields.trigger_data))
    expect(triggerData.created_time).toBeDefined()
  })

  test('should update a page property after being created', async () => {
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
            table: env.TEST_NOTION_TABLE_1_ID,
          },
          actions: [
            {
              name: 'update-page',
              integration: 'Notion',
              action: 'UpdatePage',
              table: env.TEST_NOTION_TABLE_1_ID,
              id: '{{trigger.id}}',
              page: {
                name: 'My new page updated',
              },
            },
          ],
        },
      ],
      integrations: {
        notion: {
          token: env.TEST_NOTION_TOKEN,
          pollingInterval: 5,
        },
      },
      database: dbConfig,
    }
    const app = new App()
    await app.start(config)

    // WHEN
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const { id } = await testTable.create({
      name: 'My new page',
    })

    // THEN
    await database.waitForAutomationHistory('page-created', {
      field: 'trigger_data',
      operator: 'Contains',
      value: id,
    })
    const page = await testTable.retrieve(id)
    expect(page.properties.name).toBe('My new page updated')
  })
})
