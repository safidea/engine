import { testNgrokIntegration } from 'test/e2e/integrations/ngrok.shared'
import { NgrokBunIntegration } from './NgrokIntegration'
import runner from 'bun:test'

const integration = new NgrokBunIntegration({
  authToken: 'test',
})

testNgrokIntegration(runner, integration)
