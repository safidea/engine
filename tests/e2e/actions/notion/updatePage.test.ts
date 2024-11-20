import { test, expect, env } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import { integration } from '@tests/integrations/notion'

test.describe('Update Notion page action', () => {
  test('should update a page', async ({ request }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'updatePage',
          trigger: {
            service: 'Http',
            event: 'ApiCalled',
            path: 'update-page',
            input: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
              },
            },
          },
          actions: [
            {
              name: 'updatePage',
              integration: 'Notion',
              action: 'UpdatePage',
              table: env.TEST_NOTION_TABLE_ID,
              id: '{{trigger.body.id}}',
              page: {
                name: 'John Doe',
              },
            },
          ],
        },
      ],
      integrations: {
        notion: {
          token: env.TEST_NOTION_TOKEN,
        },
      },
    }
    const app = new App()
    const url = await app.start(config)
    const table = await integration.table(env.TEST_NOTION_TABLE_ID)
    const { id } = await table.create({ name: 'John' })

    // WHEN
    await request.post(`${url}/api/automation/update-page`, {
      data: { id },
    })

    // THEN
    const response = await table.retrieve(id)
    expect(response.properties.name).toBe('John Doe')
  })
})
