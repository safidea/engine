import { EnrichedRecordDto, RecordDto } from '@application/dtos/table/RecordDto'

export interface Response {
  status?: number
  json:
    | RecordDto
    | RecordDto[]
    | EnrichedRecordDto
    | { id: string }
    | { ids: string[] }
    | { error: string }
    | { success: boolean }
}
