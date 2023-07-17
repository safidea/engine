export interface RecordDto {
  [key: string]: string | number | boolean | RecordDto | RecordDto[]
}
