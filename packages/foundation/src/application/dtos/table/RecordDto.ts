type RecordFieldDto = string | number | boolean | undefined | string[]

interface CreateSingleLinkedRecordDto {
  create: RecordToCreateDto
}

interface CreateMultipleLinkedRecordsDto {
  create: RecordToCreateDto[]
}

interface UpdateSingleLinkedRecordDto {
  update: RecordToCreateDto
}

interface UpdateMultipleLinkedRecordsDto {
  update: RecordToCreateDto[]
}

export interface RecordToCreateDto {
  [key: string]: RecordFieldDto | CreateSingleLinkedRecordDto | CreateMultipleLinkedRecordsDto
}

export interface RecordToUpdateDto {
  [key: string]: RecordFieldDto | UpdateSingleLinkedRecordDto | UpdateMultipleLinkedRecordsDto
}

export interface RecordDto {
  [key: string]: RecordFieldDto
}
