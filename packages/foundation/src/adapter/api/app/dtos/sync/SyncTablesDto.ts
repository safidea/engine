import { RecordDto } from '../RecordDto'

export interface SyncTablesDto {
  [key: string]: RecordDto[] | undefined
}
