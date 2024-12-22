import type { IMonitorDriver } from '@adapter/spi/drivers/MonitorSpi'
import * as Sentry from '@sentry/node'

export class SentryDriver implements IMonitorDriver {
  captureException = (error: Error) => {
    Sentry.captureException(error)
  }

  captureMessage = (message: string) => {
    Sentry.captureMessage(message)
  }
}
