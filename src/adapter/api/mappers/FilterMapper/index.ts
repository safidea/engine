import type { Filter } from '@domain/entities/Filter'
import type { Filter as Config } from '@adapter/api/configs/Filter'
import { IsAnyOfMapper } from './IsAnyOfMapper'
import { IsMapper } from './IsMapper'

export class FilterMapper {
  static toEntity = (config: Config): Filter => {
    const { operator } = config
    if (operator === 'isAnyOf') return IsAnyOfMapper.toEntity(config)
    if (operator === 'is') return IsMapper.toEntity(config)
    throw new Error(`FilterMapper: operator ${operator} not supported`)
  }

  static toManyEntities = (filters: Config[]): Filter[] => {
    return filters.map(this.toEntity)
  }
}
