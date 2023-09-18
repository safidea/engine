import { FilterDto } from '@adapters/dtos/FilterDto'
import { Filter, newFilter } from '@entities/services/database/filter/Filter'

export class FilterMapper {
  static toFilter(dto: FilterDto): Filter {
    return newFilter(dto)
  }

  static toManyFilters(dtos: FilterDto[]): Filter[] {
    return dtos.map(this.toFilter)
  }
}
