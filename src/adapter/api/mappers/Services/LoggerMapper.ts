import type { Drivers } from '@adapter/spi/drivers'
import { LoggerSpi } from '@adapter/spi/drivers/LoggerSpi'
import { Logger, type LoggersConfig } from '@domain/services/Logger'

export class LoggerMapper {
  static toService(drivers: Drivers, config: LoggersConfig = []): Logger {
    const driver = drivers.logger(config)
    const spi = new LoggerSpi(driver)
    return new Logger(spi)
  }
}
