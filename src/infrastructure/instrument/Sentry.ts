import type { MonitorSentryConfig } from '@domain/services/Monitor'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export function init(config: MonitorSentryConfig) {
  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  })
}
