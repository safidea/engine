import { Open, type Services } from '@domain/entities/Event/Open'
import type { Open as Config } from '@adapter/api/configs/Event/Open'

export class OpenMapper {
  static toEntity = (config: Config, services: Services): Open => {
    return new Open(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Open[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
