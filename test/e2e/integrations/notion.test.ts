import { runner } from '@test/fixtures'
import { testNotionIntegration } from './notion.shared'
import { integration } from './notion'
import env from '@test/env'

testNotionIntegration(
  {
    ...runner,
    env: {
      TABLE_ID: env.TEST_NOTION_TABLE_1_ID,
    },
  },
  integration
)
