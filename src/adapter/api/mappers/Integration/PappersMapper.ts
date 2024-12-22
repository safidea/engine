import type { Integrations } from '@adapter/spi/integrations'
import { PappersSpi } from '@adapter/spi/integrations/PappersSpi'
import { Pappers, type PappersConfig } from '@domain/integrations/Pappers'

export class PappersMapper {
  static toIntegration(integrations: Integrations, config?: PappersConfig): Pappers {
    const driver = integrations.pappers(config)
    const spi = new PappersSpi(driver)
    return new Pappers(spi)
  }
}
