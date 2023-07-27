import { RecordDto } from '@application/dtos/RecordDto'
import { GroupBy, SortBy } from '@domain/entities/components/List'
import { IUIRepository } from '@domain/repositories/IUIRepository'
import { IFetcherRepository } from '@domain/repositories/IFetcherRepository'

export class PageRepository {
  constructor(
    private readonly ui: IUIRepository,
    private readonly fetcher: IFetcherRepository
  ) {}

  getUI(): IUIRepository {
    return this.ui
  }

  getTableRecords(
    table: string,
    options: { groupBy: GroupBy[]; sortBy: SortBy[] }
  ): () => {
    records: RecordDto[]
    error: Error | undefined
    isLoading: boolean
  } {
    const useFetch = this.fetcher
    return function () {
      const { data = [], error, isLoading } = useFetch<RecordDto[]>(`/api/table/${table}`)
      return {
        records: data,
        error,
        isLoading,
      }
    }
  }
}
