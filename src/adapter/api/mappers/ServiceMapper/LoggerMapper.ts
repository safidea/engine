import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger, type Config } from '@domain/services/Logger'

export class LoggerMapper {
  static toService(
    drivers: Drivers,
    config: Config = { driver: 'Console', level: 'info' }
  ): Logger {
    config.level = config.level ?? 'info'
    const driver = drivers.logger(config)
    const spi = new LoggerSpi(driver)
    return new Logger(spi)
  }
}
