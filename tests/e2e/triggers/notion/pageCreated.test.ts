import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import { testTable } from '@tests/integrations/notion'

test.describe('PageCreated trigger', () => {
  test.skip('should start an automation when a Notion page is created in a table', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      automations: [
        {
          name: 'Send email',
          trigger: {
            service: 'Notion',
            event: 'PageCreated',
            tableId: '1369911026ec80b3b739d81a17787121',
          },
          actions: [
            {
              name: 'Run TypeScript code',
              service: 'Code',
              action: 'RunTypescript',
              code: String(async function () {
                return { success: true }
              }),
            },
          ],
        },
      ],
    }
    const app = new App()
    await app.start(config)

    // WHEN
    const id = await testTable.create({
      Nom: 'My new page',
    })

    // THEN
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const updatedPage = await testTable.retrieve(id)
    await testTable.archive(id)
    expect(updatedPage.properties.Nom).toBe('My new page updated')
  })
})
