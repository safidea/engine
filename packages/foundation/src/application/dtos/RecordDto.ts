export interface RecordDto {
  [key: string]: string | number | boolean | undefined
  id: string
  created_time: string
  last_modified_time?: string
  deleted_time?: string
}
