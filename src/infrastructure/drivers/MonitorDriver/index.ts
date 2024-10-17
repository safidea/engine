import type { Config } from '@domain/services/Monitor'
import type { Driver } from '@adapter/spi/MonitorSpi'
import { SentryDriver } from './SentryDriver'
import { ConsoleDriver } from './ConsoleDriver'

export class MonitorDriver implements Driver {
  private _monitors: (SentryDriver | ConsoleDriver)[] = []

  constructor(config: Config) {
    for (const monitor of config) {
      const { driver } = monitor
      if (driver === 'Sentry') {
        this._monitors.push(new SentryDriver())
      } else if (driver === 'Console') {
        this._monitors.push(new ConsoleDriver())
      } else throw new Error(`MonitorDriver: monitor "${driver}" not supported`)
    }
  }

  captureException = (error: Error) => {
    this._monitors.map((m) => m.captureException(error))
  }

  captureMessage = (message: string) => {
    this._monitors.map((m) => m.captureMessage(message))
  }
}
