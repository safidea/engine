import { FilterDto } from './FilterDto'
import { RecordDto } from './RecordDto'

export interface LocalWithTableDto {
  table: string
}

export interface LocalWithTableAndFiltersDto extends LocalWithTableDto {
  table: string
  filters: FilterDto[]
}

export interface LocalWithTableAndIdDto extends LocalWithTableDto {
  table: string
  id: string
}

export interface LocalWithTableAndRecordDto extends LocalWithTableDto {
  table: string
  record: RecordDto
}

export interface LocalWithTableAndArrayRecordDto extends LocalWithTableDto {
  table: string
  records: RecordDto[]
}

export interface LocalWithTableAndRecordAndIdDto extends LocalWithTableAndIdDto {
  id: string
  table: string
  record: RecordDto
}
