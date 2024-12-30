import { expect, test, env } from '@test/fixtures'
import { testNotionIntegration } from './notion.shared'
import { integration } from './notion'

testNotionIntegration(
  {
    describe: test.describe,
    it: test,
    expect,
    slow: test.slow,
    env: {
      TABLE_ID: env.TEST_NOTION_TABLE_1_ID,
    },
  },
  integration
)
