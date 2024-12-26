import {
  type Filter,
  type FilterDto,
  FilterMapper as FilterDomainMapper,
} from '@domain/entities/Filter'

export class FilterMapper extends FilterDomainMapper {
  static toDto = (filter: Filter): FilterDto => {
    return filter.toDto()
  }
}
