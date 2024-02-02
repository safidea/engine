import type { LoggerDriver } from '@adapter/spi/LoggerSpi'
import debug from 'debug'

export class DebugLoggerDriver implements LoggerDriver {
  public log: (message: string) => void

  constructor(location: string) {
    this.log = debug(`engine:${location}`)
  }
}
