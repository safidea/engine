import { IsAnyOf } from '@domain/entities/Filter/IsAnyOf'
import type { IsAnyOf as Config } from '@adapter/api/configs/Filter/IsAnyOf'

export class IsAnyOfMapper {
  static toEntity = (config: Config): IsAnyOf => {
    return new IsAnyOf(config)
  }

  static toManyEntities = (configs: Config[]): IsAnyOf[] => {
    return configs.map(this.toEntity)
  }
}
