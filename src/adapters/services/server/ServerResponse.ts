import { PersistedRecordDto } from '@adapters/dtos/RecordDto'
import { SyncRecordsByTableDto } from '@adapters/dtos/SyncDto'

export interface ServerResponse {
  status?: number
  json?: {
    record?: PersistedRecordDto
    records?: PersistedRecordDto[]
    id?: string
    ids?: string[]
    error?: string
    tables?: SyncRecordsByTableDto
  }
  html?: string
  file?: string
  headers?: { [key: string]: string }
}
