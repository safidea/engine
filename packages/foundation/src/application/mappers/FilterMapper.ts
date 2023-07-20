import { FilterDto } from '@application/dtos/FilterDto'
import { Filter } from '@domain/entities/Filter'
import { IsAnyOf } from '@domain/entities/filters/IsAnyOf'

export function mapDtoToFilter(filterDto: FilterDto): Filter {
  const { field, operator, value } = filterDto
  if (operator === 'is_any_of') {
    if (!Array.isArray(value)) throw new Error('Invalid filter value')
    return new IsAnyOf(field, value)
  }
  throw new Error(`Invalid filter operator ${operator}`)
}
