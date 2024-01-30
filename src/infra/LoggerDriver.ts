import debug from 'debug'
import type { ILoggerDriver } from '@adapter/spi/drivers/ILoggerDriver'

export class LoggerDriver implements ILoggerDriver {
  public log: (message: string) => void

  constructor(location: string) {
    this.log = debug(`engine:${location}`)
  }
}
