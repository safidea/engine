export interface RecordDto {
  [key: string]: string | number | boolean | undefined
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string
}
