import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
import { notion } from '@tests/notion'

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
    const createdPage = await notion.pages.create({
      parent: { database_id: '1369911026ec80b3b739d81a17787121' },
      properties: {
        Nom: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: 'My new page',
              },
            },
          ],
        },
      },
    })

    // THEN
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const updatedPage = await notion.pages.retrieve({
      page_id: createdPage.id,
    })
    if (
      !('properties' in updatedPage) ||
      !('title' in updatedPage.properties.Nom) ||
      !('text' in updatedPage.properties.Nom.title[0])
    ) {
      throw new Error('Page properties are missing')
    }
    await notion.pages.update({
      page_id: updatedPage.id,
      archived: true,
    })
    expect(updatedPage.properties.Nom.title[0].text.content).toBe('My new page updated')
  })
})
