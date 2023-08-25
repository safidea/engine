import { FilterDto } from '@adapter/spi/orm/dtos/FilterDto'
import { Filter } from '@domain/entities/orm/Filter'
import { IsAnyOfFilter } from '@domain/entities/orm/filters/IsAnyOfFilter'
import { IsFilter } from '@domain/entities/orm/filters/IsFilter'

export class FilterMapper {
  static toEntity(filterDto: FilterDto): Filter {
    const { field, operator, value } = filterDto
    if (operator === 'is_any_of') {
      if (!Array.isArray(value)) throw new Error('Invalid filter value')
      return new IsAnyOfFilter(field, value)
    }
    if (operator === 'is') {
      if (typeof value !== 'string') throw new Error('Invalid filter value')
      return new IsFilter(field, value)
    }
    throw new Error(`Invalid filter operator ${operator}`)
  }

  static toDto(filter: Filter): FilterDto {
    const { field, operator } = filter
    if (filter instanceof IsAnyOfFilter) {
      return {
        field,
        operator: 'is_any_of',
        value: filter.values,
      }
    }
    if (filter instanceof IsFilter) {
      return {
        field,
        operator: 'is',
        value: filter.value,
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
