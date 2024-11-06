import { test, expect } from '@tests/fixtures'
import { NotionIntegration } from '@infrastructure/integrations/NotionIntegration'
import { Client } from '@notionhq/client'

// Initializing a client
export const notion = new Client({
  auth: process.env.TEST_NOTION_TOKEN,
})

test.describe('Notion integration', () => {
  test('should create a page in a table with a title property', async () => {
    // GIVEN
    const { TEST_NOTION_TOKEN, TEST_NOTION_TABLE_ID } = process.env
    const notionIntegration = new NotionIntegration({
      token: TEST_NOTION_TOKEN!,
    })
    const table = await notionIntegration.table(TEST_NOTION_TABLE_ID!)

    // WHEN
    const id = await table.create({
      Nom: 'My new page',
    })

    // THEN
    await notion.pages.update({ page_id: id, archived: true })
    expect(id).toBeDefined()
  })
})
