import { Open } from '@domain/entities/Event/Open'
import type { Open as Config } from '@adapter/api/configs/Event/Open'

export class OpenMapper {
  static toEntity = (config: Config): Open => {
    return new Open(config)
  }

  static toManyEntities = (configs: Config[]): Open[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
