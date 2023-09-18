import { RecordData } from '@entities/services/database/record/RecordData'
import { FetcherSyncTablesRecordsData } from '@entities/services/fetcher/sync/Sync'

export interface ServerResponse {
  status?: number
  json?: {
    record?: RecordData
    records?: RecordData[]
    id?: string
    ids?: string[]
    error?: string
    tables?: FetcherSyncTablesRecordsData
  }
  html?: string
  file?: string
  headers?: { [key: string]: string }
}
