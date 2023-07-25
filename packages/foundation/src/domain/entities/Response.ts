import { RecordDto } from '@application/dtos/RecordDto'

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
