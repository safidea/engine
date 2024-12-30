import { PappersIntegration } from '@infrastructure/integrations/PappersIntegration'
import { test, expect, env } from '@test/fixtures'
import { testPappersIntegration } from '@test/integration/pappers.shared'

const { TEST_PAPPERS_API_KEY } = env

export const integration = new PappersIntegration({
  apiKey: TEST_PAPPERS_API_KEY,
})

testPappersIntegration({ describe: test.describe, it: test, expect }, integration)
