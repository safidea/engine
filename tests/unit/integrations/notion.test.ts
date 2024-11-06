import { test, expect, env } from '@tests/fixtures'
import { notion as integration } from '@tests/integrations/notion'
import { Client } from '@notionhq/client'

const { TEST_NOTION_TOKEN, TEST_NOTION_TABLE_ID } = env

export const notion = new Client({
  auth: TEST_NOTION_TOKEN,
})

test.describe('Notion integration', () => {
  test('should create a page in a table with a title property', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)

    // WHEN
    const id = await table.create({
      Nom: 'My new page',
    })

    // THEN
    await notion.pages.update({ page_id: id, archived: true })
    expect(id).toBeDefined()
  })

  test('should retrieve a page in a table', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const id = await table.create({
      Nom: 'My new page',
    })

    // WHEN
    const page = await table.retrieve(id)

    // THEN
    await notion.pages.update({ page_id: id, archived: true })
    expect(page.properties.Nom).toBe('My new page')
  })

  test('should archive a page in a table', async () => {
    // GIVEN
    const table = await integration.table(TEST_NOTION_TABLE_ID)
    const id = await table.create({
      Nom: 'My new page',
    })

    // WHEN
    await table.archive(id)

    // THEN
    const page = await notion.pages.retrieve({ page_id: id })
    if (!('archived' in page)) {
      throw new Error('Page properties are missing')
    }
    expect(page.archived).toBe(true)
  })
})
