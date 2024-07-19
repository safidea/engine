import { WaitForAutomation } from '@domain/entities/Event/WaitForAutomation'
import type { WaitForAutomation as Config } from '@adapter/api/configs/Event/WaitForAutomation'
import type { Logger } from '@domain/services/Logger'

interface Services {
  logger: Logger
}

export class WaitForAutomationMapper {
  static toEntity = (config: Config, services: Services): WaitForAutomation => {
    const { logger } = services
    return new WaitForAutomation({ ...config, logger })
  }

  static toManyEntities = (configs: Config[], services: Services): WaitForAutomation[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
