import { testQontoIntegration } from 'test/e2e/integrations/qonto.shared'
import { QontoBunIntegration } from './QontoIntegration'
import runner from 'bun:test'

const integration = new QontoBunIntegration({
  environment: 'sandbox',
  stagingToken: 'test',
  organisationSlug: 'test',
  secretKey: 'test',
})

testQontoIntegration(runner, integration)
