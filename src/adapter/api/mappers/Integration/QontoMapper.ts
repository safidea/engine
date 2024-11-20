import type { Integrations } from '@adapter/spi/integrations'
import { QontoSpi } from '@adapter/spi/integrations/QontoSpi'
import { Qonto, type QontoConfig } from '@domain/integrations/Qonto'

export class QontoMapper {
  static toIntegration(integrations: Integrations, config?: QontoConfig): Qonto {
    const driver = integrations.qonto(config)
    const spi = new QontoSpi(driver)
    return new Qonto(spi)
  }
}
