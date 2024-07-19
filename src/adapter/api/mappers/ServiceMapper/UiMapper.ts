import type { Drivers } from '@adapter/spi/Drivers'
import { UiSpi } from '@adapter/spi/UiSpi'
import { Ui } from '@domain/services/Ui'

interface Ressources {
  drivers: Drivers
}

export class UiMapper {
  static toService(ressources: Ressources): Ui {
    const { drivers } = ressources
    const driver = drivers.ui()
    const spi = new UiSpi(driver)
    return new Ui(spi)
  }
}
