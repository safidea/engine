import { RecordDto, RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { IFetcherGateway } from '@domain/gateways/IFetcherGateway'

export class FetcherGateway {
  constructor(private readonly fetcher: IFetcherGateway) {}

  getTableRecordsHook(table: string): () => {
    records: RecordDto[]
    error: Error | undefined
    isLoading: boolean
  } {
    const { useFetch } = this.fetcher
    return function () {
      const { data = [], error, isLoading } = useFetch<RecordDto[]>(`/api/table/${table}`)
      return {
        records: data,
        error,
        isLoading,
      }
    }
  }

  createTableRecord(
    table: string
  ): (record: RecordToCreateDto) => Promise<{ id?: string; error?: string }> {
    const { fetch } = this.fetcher
    return async function (record: RecordToCreateDto) {
      const res = await fetch(`/api/table/${table}`, {
        method: 'POST',
        body: JSON.stringify(record),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const { id, error } = await res.json()
      if (res.status !== 200) {
        return { error }
      }
      return { id }
    }
  }

  async getTableRecord(table: string, recordId: string): Promise<() => RecordDto> {
    const res = await this.fetcher.fetch(`/api/table/${table}/${recordId}`, {
      method: 'GET',
    })
    if (res.status !== 200) {
      const { error } = await res.json()
      throw new Error(error)
    }
    const record = await res.json()
    return record
  }
}
