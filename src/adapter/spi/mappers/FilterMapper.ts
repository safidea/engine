import { type Filter, FilterMapper as FilterDomainMapper } from '@domain/entities/Filter'
import type { FilterDto } from '../dtos/FilterDto'

export class FilterMapper extends FilterDomainMapper {
  static toDto = (filter: Filter): FilterDto => {
    return filter.toConfig()
  }
}
