import { NotionIntegration } from '@infrastructure/integrations/NotionIntegration'
import { env } from '@tests/fixtures'

export const notion = new NotionIntegration({
  token: env.TEST_NOTION_TOKEN,
})

export const testTable = await notion.table(env.TEST_NOTION_TABLE_ID)
