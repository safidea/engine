import type { Driver } from '@adapter/spi/MonitorSpi'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export class SentryDriver implements Driver {
  constructor(dsn: string) {
    Sentry.init({
      dsn,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
      release: 'safidea/engine@' + process.env.npm_package_version,
      environment: process.env.NODE_ENV || 'development',
    })
  }

  captureException = (error: Error) => {
    Sentry.captureException(error)
  }

  captureMessage = (message: string) => {
    Sentry.captureMessage(message)
  }
}
