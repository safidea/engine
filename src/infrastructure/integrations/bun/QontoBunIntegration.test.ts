import { testQontoIntegration } from 'test/integration/qonto'
import { QontoBunIntegration } from './QontoBunIntegration'
import { describe, it, expect } from 'bun:test'

const integration = new QontoBunIntegration({
  environment: 'sandbox',
  stagingToken: 'test',
  organisationSlug: 'test',
  secretKey: 'test',
})

testQontoIntegration({ describe, it, expect }, integration)
