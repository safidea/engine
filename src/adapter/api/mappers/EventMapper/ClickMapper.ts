import { Click, type Services } from '@domain/entities/Event/Click'
import type { Click as Config } from '@adapter/api/configs/Event/Click'

export class ClickMapper {
  static toEntity = (config: Config, services: Services): Click => {
    return new Click(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Click[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
