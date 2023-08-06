import { EnrichedRecordDto, RecordDto } from '@adapter/spi/orm/dtos/RecordDto'

export interface ResponseDto {
  status?: number
  json: {
    record?: RecordDto | EnrichedRecordDto
    records?: RecordDto[]
    id?: string
    ids?: string[]
    error?: string
  }
}
