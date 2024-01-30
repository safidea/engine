export interface PersistedRecordDto {
  id: string
  created_at: Date
  updated_at?: Date
  [key: string]: string | number | boolean | Date | undefined
}
