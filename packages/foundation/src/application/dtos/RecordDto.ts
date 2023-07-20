type RecordFieldDto = string | number | boolean | string[]

interface SingleLinkedRecordDto {
  create: RecordToCreateDto
}

interface MultipleLinkedRecordsDto {
  create: RecordToCreateDto[]
}

export interface RecordToCreateDto {
  [key: string]: RecordFieldDto | SingleLinkedRecordDto | MultipleLinkedRecordsDto
}

export interface RecordDto {
  [key: string]: RecordFieldDto
}
