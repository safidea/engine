import { runner } from '@test/fixtures'
import { testNotionTableIntegration } from './notionTable.shared'
import { integration } from './notion'
import env from '@test/env'

testNotionTableIntegration(
  {
    ...runner,
    env: {
      TABLE_1_ID: env.TEST_NOTION_TABLE_1_ID,
      TABLE_2_ID: env.TEST_NOTION_TABLE_2_ID,
    },
  },
  integration
)
