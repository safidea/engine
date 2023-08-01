import { RecordDto } from '@application/dtos/table/RecordDto'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'

export class FetcherGateway {
  constructor(private readonly fetcher: IFetcherGateway) {}

  getTableRecords(table: string): () => {
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
