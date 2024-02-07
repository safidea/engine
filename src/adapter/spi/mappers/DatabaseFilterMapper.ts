import type { Filter } from '@domain/services/filter'
import type { DatabaseFilterDto } from '../dtos/DatabaseFilterDto'
import { IsAnyOf } from '@domain/services/filter/IsAnyOf'
import { Is } from '@domain/services/filter/Is'
import { type Filter as FilterConfig } from '@adapter/api/configs/filter'

export class DatabaseFilterMapper {
  static toEntity = (dto: DatabaseFilterDto): Filter => {
    switch (dto.operator) {
      case 'in':
        return new IsAnyOf(dto)
      case '=':
        return new Is(dto)
    }
  }

  static toManyEntities = (dtos: DatabaseFilterDto[]): Filter[] => {
    return dtos.map(this.toEntity)
  }

  static toEntityFromConfig = (filter: FilterConfig): Filter => {
    switch (filter.operator) {
      case 'isAnyOf':
        return new IsAnyOf(filter)
      case 'is':
        return new Is(filter)
    }
  }

  static toManyEntitiesFromConfig = (filters: FilterConfig[]): Filter[] => {
    return filters.map(this.toEntityFromConfig)
  }

  static toDto = (filter: Filter): DatabaseFilterDto => {
    if (filter instanceof IsAnyOf) {
      return {
        ...filter,
        operator: 'in',
      }
    }
    if (filter instanceof Is) {
      return {
        ...filter,
        operator: '=',
      }
    }
    throw new Error('Filter not supported')
  }

  static toManyDtos = (filters: Filter[]): DatabaseFilterDto[] => {
    return filters.map(this.toDto)
  }
}
