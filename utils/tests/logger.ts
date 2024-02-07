import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger } from '@domain/services/Logger'
import { DebugLoggerDriver } from '@infrastructure/drivers/DebugLoggerDriver'

export default class extends Logger {
  constructor(location: string) {
    super(new LoggerSpi(new DebugLoggerDriver({ location: '[test]:' + location })))
  }
}
