import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { FetcherConnection } from './FetcherConnection'
import { Fetcher } from './Fetcher'
import { Record } from '@domain/entities/app/Record'
import { RecordDto } from '../../api/app/dtos/RecordDto'
import { RecordMapper } from '../../api/app/mappers/RecordMapper'
import { App } from '@domain/entities/app/App'
import { SyncCommandDto } from '@adapter/api/app/dtos/SyncDto'

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
    const useFetch = this.fetcherConnection.getUseFetch()
    const toEntities = (recordsDto: RecordDto[]) =>
      RecordMapper.toEntities(recordsDto, this.app.getTableByName(table))
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

  syncTableRecords(): (records: Record[]) => Promise<{ error?: string }> {
    const fetch = this.fetcherConnection.getFetch()
    return async (records: Record[]) => {
      const commands: SyncCommandDto[] = records.map((record) => {
        if (record.state === 'read') throw new Error('Record is read-only')
        return {
          type: record.state,
          table: record.table.name,
          record: RecordMapper.toDto(record),
        }
      })
      const res = await fetch(`/api/table/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands }),
      })
      return res.json()
    }
  }
}
