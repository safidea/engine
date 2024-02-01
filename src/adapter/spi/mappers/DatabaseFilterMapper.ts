import type { Filter } from '@domain/services/filter'
import type { DatabaseFilterDto } from '../dtos/DatabaseFilterDto'
import { IsAnyOfFilter } from '@domain/services/filter/IsAnyOfFilter'
import { IsFilter } from '@domain/services/filter/IsFilter'

export class DatabaseFilterMapper {
  static toEntity = (dto: DatabaseFilterDto): Filter => {
    switch (dto.operator) {
      case 'in':
        return new IsAnyOfFilter({
          field: dto.column,
          value: dto.value,
        })
      case '=':
        return new IsFilter({
          field: dto.column,
          value: dto.value,
        })
    }
  }

  static toManyEntities = (dtos: DatabaseFilterDto[]): Filter[] => {
    return dtos.map(this.toEntity)
  }

  static toDto = (filter: Filter): DatabaseFilterDto => {
    if (filter instanceof IsAnyOfFilter) {
      return {
        column: filter.field,
        operator: 'in',
        value: filter.value,
      }
    }
    if (filter instanceof IsFilter) {
      return {
        column: filter.field,
        operator: '=',
        value: filter.value,
      }
    }
    throw new Error('Filter not supported')
  }

  static toManyDtos = (filters: Filter[]): DatabaseFilterDto[] => {
    return filters.map(this.toDto)
  }
}
