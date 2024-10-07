import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger, type Config } from '@domain/services/Logger'

export class LoggerMapper {
  static buildConfigWithDefaults(config: Config = { driver: 'Console' }): Config {
    config.level = config.level ?? 'info'
    config.silent = config.silent ?? (process.env.TESTING === 'true' && config.level === 'info')
    return config
  }

  static toService(drivers: Drivers, config?: Config): Logger {
    const configWithDefaults = this.buildConfigWithDefaults(config)
    const driver = drivers.logger(configWithDefaults)
    const spi = new LoggerSpi(driver)
    return new Logger(spi)
  }
}
