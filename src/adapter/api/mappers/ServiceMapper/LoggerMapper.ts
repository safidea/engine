import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger } from '@domain/services/Logger'

interface Ressources {
  drivers: Drivers
}

export class LoggerMapper {
  static toService(ressources: Ressources): Logger {
    const { drivers } = ressources
    const driver = drivers.logger()
    const spi = new LoggerSpi(driver)
    return new Logger(spi)
  }
}
