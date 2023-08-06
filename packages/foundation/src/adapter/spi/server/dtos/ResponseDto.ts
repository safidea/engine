import { RecordDto } from '@adapter/api/app/dtos/RecordDto'

export interface ResponseDto {
  status?: number
  json: {
    record?: RecordDto
    records?: RecordDto[]
    id?: string
    ids?: string[]
    error?: string
  }
}
