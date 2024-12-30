import { expect, test } from '@test/fixtures'
import { testNotionIntegration } from './notion.shared'
import { integration } from './notion'

testNotionIntegration({ describe: test.describe, it: test, expect, slow: test.slow }, integration)
