import type { Drivers } from '@adapter/spi/Drivers'
import { ClientSpi } from '@adapter/spi/ClientSpi'
import { Client } from '@domain/services/Client'

interface Ressources {
  drivers: Drivers
}

export class ClientMapper {
  static toService(ressources: Ressources): Client {
    const { drivers } = ressources
    const driver = drivers.client()
    const spi = new ClientSpi(driver)
    return new Client(spi)
  }
}
