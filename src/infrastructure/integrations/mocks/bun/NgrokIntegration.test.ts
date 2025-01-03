import { testNgrokIntegration } from 'test/e2e/integrations/ngrok.shared'
import { NgrokIntegration } from './NgrokIntegration'
import runner from 'bun:test'

const integration = new NgrokIntegration({
  authToken: 'test',
})

testNgrokIntegration(runner, integration)
