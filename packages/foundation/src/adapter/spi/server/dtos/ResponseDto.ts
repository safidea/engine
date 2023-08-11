import { RecordDto } from '@adapter/api/app/dtos/RecordDto'
import { TablesSyncDto } from '@adapter/api/app/dtos/sync/TablesSyncDto'

export interface ResponseDto {
  status?: number
  json: {
    record?: RecordDto
    records?: RecordDto[]
    id?: string
    ids?: string[]
    error?: string
    tables?: TablesSyncDto
  }
}
