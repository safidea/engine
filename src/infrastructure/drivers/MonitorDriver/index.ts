import type { Config } from '@domain/services/Monitor'
import type { Driver } from '@adapter/spi/MonitorSpi'
import { SentryDriver } from './SentryDriver'
import { ConsoleDriver } from './ConsoleDriver'

export class MonitorDriver implements Driver {
  private _monitor: SentryDriver | ConsoleDriver

  constructor(config: Config) {
    const { driver } = config
    if (driver === 'Sentry') {
      this._monitor = new SentryDriver(config.dsn)
    } else if (driver === 'Console') {
      this._monitor = new ConsoleDriver()
    } else throw new Error(`MonitorDriver: monitor "${driver}" not supported`)
  }

  captureException = (error: Error) => {
    this._monitor.captureException(error)
  }

  captureMessage = (message: string) => {
    this._monitor.captureMessage(message)
  }
}
