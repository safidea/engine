import { Click } from '@domain/entities/Event/Click'
import type { Click as Config } from '@adapter/api/configs/Event/Click'

export class ClickMapper {
  static toEntity = (config: Config): Click => {
    return new Click(config)
  }

  static toManyEntities = (configs: Config[]): Click[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
