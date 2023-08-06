export type RecordFieldValue = string | number | boolean | undefined | string[]

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
  [key: string]: RecordFieldValue | CreateSingleLinkedRecordDto | CreateMultipleLinkedRecordsDto
}

export interface RecordToUpdateDto {
  [key: string]: RecordFieldValue | UpdateSingleLinkedRecordDto | UpdateMultipleLinkedRecordsDto
}

export interface RecordDto {
  [key: string]: RecordFieldValue
}

export interface EnrichedRecordDto {
  [key: string]: RecordFieldValue | RecordDto | RecordDto[]
}
