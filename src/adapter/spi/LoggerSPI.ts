import type { LoggerSPI as ILoggerSPI } from '@domain/services/Logger'

export interface LoggerDriver {
  log: (message: string) => void
}

export class LoggerSPI implements ILoggerSPI {
  constructor(private driver: LoggerDriver) {}

  log = (message: string) => this.driver.log(message)
}
