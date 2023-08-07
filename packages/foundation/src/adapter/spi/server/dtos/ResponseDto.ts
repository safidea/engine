import { RecordDto } from '@adapter/api/app/dtos/RecordDto'
import { SyncTablesDto } from '@adapter/api/app/dtos/sync/SyncTablesDto'

export interface ResponseDto {
  status?: number
  json: {
    record?: RecordDto
    records?: RecordDto[]
    id?: string
    ids?: string[]
    error?: string
    tables?: SyncTablesDto
  }
}
