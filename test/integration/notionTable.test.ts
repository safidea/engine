import { expect, test, env } from '@test/fixtures'
import { testNotionTableIntegration } from './notionTable.shared'
import { integration } from './notion'

testNotionTableIntegration(
  {
    describe: test.describe,
    it: test,
    expect,
    slow: test.slow,
    env: {
      TABLE_1_ID: env.TEST_NOTION_TABLE_1_ID,
      TABLE_2_ID: env.TEST_NOTION_TABLE_2_ID,
    },
  },
  integration
)
