import { test, expect } from '@test/fixtures'
import { env } from '@test/fixtures'
import { NgrokIntegration } from '@infrastructure/integrations/NgrokIntegration'
import { testNgrokIntegration } from './ngrok'

const integration = new NgrokIntegration({
  authToken: env.TEST_NGROK_AUTH_TOKEN,
})

testNgrokIntegration({ describe: test.describe, it: test, expect }, integration)
