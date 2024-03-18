import type { Filter } from '@domain/entities/filter'
import type { FilterDto } from '../dtos/FilterDto'
import { IsAnyOf } from '@domain/entities/filter/IsAnyOf'
import { Is } from '@domain/entities/filter/Is'
import { type Filter as FilterConfig } from '@adapter/api/configs/filter'

export class FilterMapper {
  static toEntity = (dto: FilterDto): Filter => {
    switch (dto.operator) {
      case 'in':
        return new IsAnyOf(dto)
      case '=':
        return new Is(dto)
    }
  }

  static toManyEntities = (dtos: FilterDto[]): Filter[] => {
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

  static toDto = (filter: Filter): FilterDto => {
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

  static toManyDtos = (filters: Filter[]): FilterDto[] => {
    return filters.map(this.toDto)
  }
}
