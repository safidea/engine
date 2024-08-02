import type { Filter } from '@domain/entities/Filter'
import type { FilterDto } from '../dtos/FilterDto'
import { IsAnyOf } from '@domain/entities/Filter/IsAnyOf'
import { Is } from '@domain/entities/Filter/Is'

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
    throw new Error('Filter operator not supported')
  }

  static toManyDtos = (filters: Filter[]): FilterDto[] => {
    return filters.map(this.toDto)
  }
}
