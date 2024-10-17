import type { Driver } from '@adapter/spi/MonitorSpi'
import * as Sentry from '@sentry/node'

export class SentryDriver implements Driver {
  captureException = (error: Error) => {
    Sentry.captureException(error)
  }

  captureMessage = (message: string) => {
    Sentry.captureMessage(message)
  }
}
