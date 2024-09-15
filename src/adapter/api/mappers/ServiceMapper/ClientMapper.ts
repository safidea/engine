import type { Drivers } from '@adapter/spi/Drivers'
import { ClientSpi } from '@adapter/spi/ClientSpi'
import { Client } from '@domain/services/Client'

export class ClientMapper {
  static toService(drivers: Drivers): Client {
    const driver = drivers.client()
    const spi = new ClientSpi(driver)
    return new Client(spi)
  }
}
