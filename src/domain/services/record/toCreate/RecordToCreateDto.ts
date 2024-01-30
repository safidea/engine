export interface RecordToCreateDto {
  id: string
  created_at: Date
  [key: string]: string | number | boolean | Date | undefined
}
