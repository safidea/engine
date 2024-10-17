import { WaitForAutomation } from '@domain/entities/Event/WaitForAutomation'
import type { WaitForAutomation as Config } from '@adapter/api/configs/Event/WaitForAutomation'

export class WaitForAutomationMapper {
  static toEntity = (config: Config): WaitForAutomation => {
    return new WaitForAutomation(config)
  }

  static toManyEntities = (configs: Config[]): WaitForAutomation[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
