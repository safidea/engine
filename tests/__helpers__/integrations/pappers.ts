import { PappersIntegration } from '@infrastructure/integrations/PappersIntegration'
import { env } from '@tests/fixtures'

const { TEST_PAPPERS_API_KEY } = env

export const integration = new PappersIntegration({
  apiKey: TEST_PAPPERS_API_KEY,
})
