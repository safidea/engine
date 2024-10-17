import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger, type Config } from '@domain/services/Logger'

export class LoggerMapper {
  static toService(drivers: Drivers, config: Config = []): Logger {
    const driver = drivers.logger(config)
    const spi = new LoggerSpi(driver)
    return new Logger(spi, config)
  }
}
