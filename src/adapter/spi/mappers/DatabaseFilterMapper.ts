import type { Filter } from '@domain/services/Filter'
import type { DatabaseFilterDto } from '../dtos/DatabaseFilterDto'
import { IsAnyOf } from '@domain/services/Filter/IsAnyOf'
import { Is } from '@domain/services/Filter/Is'

export class DatabaseFilterMapper {
  static toEntity = (dto: DatabaseFilterDto): Filter => {
    switch (dto.operator) {
      case 'in':
        return new IsAnyOf({
          field: dto.column,
          value: dto.value,
        })
      case '=':
        return new Is({
          field: dto.column,
          value: dto.value,
        })
    }
  }

  static toManyEntities = (dtos: DatabaseFilterDto[]): Filter[] => {
    return dtos.map(this.toEntity)
  }

  static toDto = (filter: Filter): DatabaseFilterDto => {
    if (filter instanceof IsAnyOf) {
      return {
        column: filter.field,
        operator: 'in',
        value: filter.value,
      }
    }
    if (filter instanceof Is) {
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
