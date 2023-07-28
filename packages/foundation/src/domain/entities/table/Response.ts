import { RecordDto } from '@application/dtos/table/RecordDto'

export interface Response {
  status?: number
  json:
    | RecordDto
    | RecordDto[]
    | { id: string }
    | { ids: string[] }
    | { error: string }
    | { success: boolean }
}
