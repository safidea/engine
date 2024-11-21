import { NotionIntegration } from '@infrastructure/integrations/NotionIntegration'
import { env } from '@tests/fixtures'
import { Client } from '@notionhq/client'
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'

const { TEST_NOTION_TOKEN, TEST_NOTION_TABLE_ID } = env

export const notion = new Client({
  auth: TEST_NOTION_TOKEN,
})

export const integration = new NotionIntegration({
  token: env.TEST_NOTION_TOKEN,
  pollingInterval: 10,
})

export const testTable = await integration.table(env.TEST_NOTION_TABLE_ID)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const archiveAllPages = async () => {
  let pages: QueryDatabaseResponse['results'] = []
  let cursor = undefined
  do {
    const response = await notion.databases.query({
      database_id: TEST_NOTION_TABLE_ID,
      start_cursor: cursor,
    })
    pages = pages.concat(response.results)
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)
  for (const page of pages) {
    await notion.pages.update({
      page_id: page.id,
      archived: true,
    })
    await delay(500)
  }
}
