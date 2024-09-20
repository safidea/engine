import type { Driver } from '@adapter/spi/MonitorSpi'
import * as Sentry from '@sentry/node'

export class SentryDriver implements Driver {
  constructor() {
    if (!process.env.SENTRY_DSN) throw new Error('SENTRY_DSN env is required')
  }

  captureException = (error: Error) => {
    Sentry.captureException(error)
  }

  captureMessage = (message: string) => {
    Sentry.captureMessage(message)
  }
}
