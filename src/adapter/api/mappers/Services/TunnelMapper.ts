import type { Drivers } from '@adapter/spi/drivers'
import { TunnelSpi } from '@adapter/spi/drivers/TunnelSpi'
import { Tunnel, type TunnelConfig } from '@domain/services/Tunnel'

export class TunnelMapper {
  static toService(drivers: Drivers, config?: TunnelConfig): Tunnel {
    const driver = drivers.tunnel(config)
    const spi = new TunnelSpi(driver)
    return new Tunnel(spi)
  }
}
