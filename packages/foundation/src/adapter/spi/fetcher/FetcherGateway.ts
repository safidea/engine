import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { FetcherConnection } from './FetcherConnection'
import { Fetcher } from './Fetcher'
import { Record } from '@domain/entities/app/Record'
import { RecordDto } from '../orm/dtos/RecordDto'
import { RecordMapper } from '../orm/mappers/RecordMapper'
import { App } from '@domain/entities/app/App'

export class FetcherGateway implements FetcherGatewayAbstract {
  private fetcherConnection: FetcherConnection

  constructor(
    fetcher: Fetcher,
    private app: App
  ) {
    this.fetcherConnection = new FetcherConnection(fetcher)
  }

  getTableRecordsHook(table: string): () => {
    records: Record[]
    error?: string
    isLoading: boolean
  } {
    const { useFetch } = this.fetcherConnection
    const toEntities = (recordsDto: RecordDto[]) =>
      RecordMapper.toEntities(recordsDto, this.app, table)
    return function () {
      const {
        data: recordsDto = [],
        error,
        isLoading,
      } = useFetch<RecordDto[]>(`/api/table/${table}`)
      return {
        records: toEntities(recordsDto),
        error,
        isLoading,
      }
    }
  }

  createTableRecord(table: string): (record: Record) => Promise<{ id?: string; error?: string }> {
    const { fetch } = this.fetcherConnection
    return async function (record: Record) {
      const res = await fetch(`/api/table/${table}`, {
        method: 'POST',
        body: JSON.stringify(RecordMapper.toDto(record)),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.json()
    }
  }

  async getEnrichedTableRecord(
    table: string,
    recordId: string
  ): Promise<{ record?: Record; error?: string }> {
    const res = await this.fetcherConnection.fetch(`/api/table/${table}/${recordId}?enriched=true`)
    const { record: recordDto, error } = await res.json()
    return { record: RecordMapper.toEntity(recordDto, this.app, table), error }
  }
}
