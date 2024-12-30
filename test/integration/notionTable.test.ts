import { expect, test } from '@test/fixtures'
import { testNotionTableIntegration } from './notionTable.shared'
import { integration } from './notion'

testNotionTableIntegration(
  { describe: test.describe, it: test, expect, slow: test.slow },
  integration
)
