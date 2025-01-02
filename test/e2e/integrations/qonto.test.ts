import { runner } from '@test/fixtures'
import { QontoIntegration } from '@infrastructure/integrations/QontoIntegration'
import { testQontoIntegration } from './qonto.shared'
import env from '@test/env'

const { TEST_QONTO_ORGANISATION_SLUG, TEST_QONTO_SECRET_KEY, TEST_QONTO_STAGING_TOKEN } = env

export const integration = new QontoIntegration({
  environment: 'sandbox',
  stagingToken: TEST_QONTO_STAGING_TOKEN,
  organisationSlug: TEST_QONTO_ORGANISATION_SLUG,
  secretKey: TEST_QONTO_SECRET_KEY,
})

testQontoIntegration(runner, integration)
