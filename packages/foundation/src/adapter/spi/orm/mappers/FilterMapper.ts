import { FilterDto } from '@adapter/spi/orm/dtos/FilterDto'
import { Filter } from '@domain/entities/app/Filter'
import { IsAnyOf } from '@domain/entities/app/filters/IsAnyOf'

export class FilterMapper {
  static toEntity(filterDto: FilterDto): Filter {
    const { field, operator, value } = filterDto
    if (operator === 'is_any_of') {
      if (!Array.isArray(value)) throw new Error('Invalid filter value')
      return new IsAnyOf(field, value)
    }
    throw new Error(`Invalid filter operator ${operator}`)
  }

  static toDto(filter: Filter): FilterDto {
    const { field, operator } = filter
    if (filter instanceof IsAnyOf) {
      return {
        field,
        operator: 'is_any_of',
        value: filter.values,
      }
    }
    throw new Error(`Invalid filter operator ${operator}`)
  }

  static toEntities(filterDtos: FilterDto[]): Filter[] {
    return filterDtos.map((filterDto) => this.toEntity(filterDto))
  }

  static toDtos(filters: Filter[]): FilterDto[] {
    return filters.map((filter) => this.toDto(filter))
  }
}
