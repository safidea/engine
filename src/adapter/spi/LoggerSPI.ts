import type { LoggerSpi as ILoggerSpi } from '@domain/services/Logger'

export interface LoggerDriver {
  log: (message: string) => void
}

export class LoggerSpi implements ILoggerSpi {
  constructor(private driver: LoggerDriver) {}

  log = (message: string) => this.driver.log(message)
}
