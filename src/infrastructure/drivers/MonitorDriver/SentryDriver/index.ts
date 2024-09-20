import type { Driver } from '@adapter/spi/MonitorSpi'
import * as Sentry from '@sentry/node'
import { SENTRY_DSN } from './env'

export class SentryDriver implements Driver {
  constructor() {
    if (!SENTRY_DSN) throw new Error('SENTRY_DSN env is required')
  }

  captureException = (error: Error) => {
    Sentry.captureException(error)
  }

  captureMessage = (message: string) => {
    Sentry.captureMessage(message)
  }
}
