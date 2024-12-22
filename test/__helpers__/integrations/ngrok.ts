import { NgrokIntegration } from '@infrastructure/integrations/NgrokIntegration'
import { env } from '@test/fixtures'

const { TEST_NGROK_AUTH_TOKEN } = env

export const integration = new NgrokIntegration({
  authToken: TEST_NGROK_AUTH_TOKEN,
})
