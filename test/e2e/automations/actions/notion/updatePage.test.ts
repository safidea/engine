import { test, expect, env, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import { integration } from 'test/e2e/integrations/notion'

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
            table: env.TEST_NOTION_TABLE_1_ID,
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
  const app = new NodeApp()
  const { url } = await app.start(config)
  const table = await integration.getTable(env.TEST_NOTION_TABLE_1_ID)
  const { id } = await table.insert({ name: 'John' })

  // WHEN
  await request.post(`${url}/api/automation/update-page`, {
    data: { id },
  })

  // THEN
  const response = await table.retrieve(id)
  expect(response.properties.name).toBe('John Doe')
})
