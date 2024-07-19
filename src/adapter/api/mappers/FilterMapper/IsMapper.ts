import { Is } from '@domain/entities/Filter/Is'
import type { Is as Config } from '@adapter/api/configs/Filter/Is'

export class IsMapper {
  static toEntity = (config: Config): Is => {
    return new Is(config)
  }

  static toManyEntities = (configs: Config[]): Is[] => {
    return configs.map(this.toEntity)
  }
}
