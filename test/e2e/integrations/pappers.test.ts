import { PappersIntegration } from '@infrastructure/integrations/PappersIntegration'
import { runner } from '@test/fixtures'
import { testPappersIntegration } from 'test/e2e/integrations/pappers.shared'
import env from '@test/env'

const { TEST_PAPPERS_API_KEY } = env

export const integration = new PappersIntegration({
  apiKey: TEST_PAPPERS_API_KEY,
})

testPappersIntegration(runner, integration)
