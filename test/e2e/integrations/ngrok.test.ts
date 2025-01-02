import { runner } from '@test/fixtures'
import { NgrokIntegration } from '@infrastructure/integrations/NgrokIntegration'
import { testNgrokIntegration } from './ngrok.shared'
import env from '@test/env'

const integration = new NgrokIntegration({
  authToken: env.TEST_NGROK_AUTH_TOKEN,
})

testNgrokIntegration(runner, integration)
