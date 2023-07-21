import { FilterDto } from '@application/dtos/FilterDto'
import { RequestWithLocalDto } from '@application/dtos/RequestDto'
import { App } from '@domain/entities/App'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

export class TableMiddleware {
  constructor(
    private readonly _app: App,
    private readonly _orm: IOrmRepository
  ) {}

  public async validateAndExtractQuery(request: RequestWithLocalDto) {
    const { query } = request
    const filters: FilterDto[] = []
    if (query) {
      for (const key in query) {
        const matchFilter = key.match(/filter_(field|operator|value)_(\d+)$/)
        if (matchFilter) {
          const index = Number(matchFilter[2])
          const value = query[key]
          filters[index] = filters[index] || {}
          if (key.startsWith('filter_field_')) {
            filters[index].field = value
          } else if (key.startsWith('filter_operator_')) {
            if (value === 'is_any_of') {
              filters[index].operator = value
            } else {
              throw new Error(`Operator ${value} is not supported`)
            }
          } else if (key.startsWith('filter_value_')) {
            if (filters[index].operator === 'is_any_of') {
              filters[index].value = value.split(',')
            }
          }
        }
      }
    }
    if (filters.length > 0) request.local.filters = filters
  }
}
