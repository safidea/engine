import type {
  PersistedRecordFields,
  RecordFields,
  RecordFieldsToCreate,
  RecordFieldsToUpdate,
} from '@domain/entities/Record'

export type PersistedRecordFieldsDto<T extends RecordFields> = PersistedRecordFields<T>
export type RecordFieldsToCreateDto<T extends RecordFields> = RecordFieldsToCreate<T>
export type RecordFieldsToUpdateDto<T extends RecordFields> = RecordFieldsToUpdate<T>
