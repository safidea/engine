import { SingleSelect } from '@domain/entities/Field/SingleSelect'
import type { SingleSelect as Config } from '@adapter/api/configs/Field/SingleSelect'

export class SingleSelectMapper {
  static toEntity = (config: Config): SingleSelect => {
    return new SingleSelect(config)
  }

  static toManyEntities = (configs: Config[]): SingleSelect[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
