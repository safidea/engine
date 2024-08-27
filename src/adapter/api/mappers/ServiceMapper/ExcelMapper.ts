import type { Drivers } from '@adapter/spi/Drivers'
import { ExcelSpi } from '@adapter/spi/ExcelSpi'
import { Excel } from '@domain/services/Excel'

interface Ressources {
  drivers: Drivers
}

export class ExcelMapper {
  static toService(ressources: Ressources): Excel {
    const { drivers } = ressources
    const driver = drivers.excel()
    const spi = new ExcelSpi(driver)
    return new Excel(spi)
  }
}
