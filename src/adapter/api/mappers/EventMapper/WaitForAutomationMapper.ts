import { WaitForAutomation, type Services } from '@domain/entities/Event/WaitForAutomation'
import type { WaitForAutomation as Config } from '@adapter/api/configs/Event/WaitForAutomation'

export class WaitForAutomationMapper {
  static toEntity = (config: Config, services: Services): WaitForAutomation => {
    return new WaitForAutomation(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): WaitForAutomation[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
