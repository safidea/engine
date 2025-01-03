import { testQontoIntegration } from 'test/e2e/integrations/qonto.shared'
import { QontoIntegration } from './QontoIntegration'
import runner from 'bun:test'

const integration = new QontoIntegration({
  environment: 'sandbox',
  stagingToken: 'test',
  organisationSlug: 'test',
  secretKey: 'test',
})

testQontoIntegration(runner, integration)
