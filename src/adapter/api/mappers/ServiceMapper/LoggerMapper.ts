import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger } from '@domain/services/Logger'

export class LoggerMapper {
  static toService(drivers: Drivers): Logger {
    const driver = drivers.logger()
    const spi = new LoggerSpi(driver)
    return new Logger(spi)
  }
}
