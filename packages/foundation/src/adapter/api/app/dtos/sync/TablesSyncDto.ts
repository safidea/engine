import { RecordDto } from '../RecordDto'

export interface TablesSyncDto {
  [key: string]: RecordDto[] | undefined
}
