import { RecordDto } from '@adapters/spi/orm/dtos/RecordDto'
import { TablesSyncDto } from '@adapters/spi/fetcher/dtos/TablesSyncDto'

export interface ResponseDto {
  status?: number
  json?: {
    record?: RecordDto
    records?: RecordDto[]
    id?: string
    ids?: string[]
    error?: string
    tables?: TablesSyncDto
  }
  file?: string
  headers?: { [key: string]: string }
}
