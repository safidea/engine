import type { Driver } from '@adapter/spi/MonitorSpi'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

const dsn = process.env.SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: global.process.env.NODE_ENV || 'development',
  })
}

export class SentryDriver implements Driver {
  constructor() {
    if (!dsn) throw new Error('SENTRY_DSN env is required')
  }

  captureException = (error: Error) => {
    Sentry.captureException(error)
  }

  captureMessage = (message: string) => {
    Sentry.captureMessage(message)
  }
}
