export type RecordFieldValue = string | number | boolean | undefined | string[]

export interface RecordFieldsValues {
  [key: string]: RecordFieldValue
}
export interface RecordData extends RecordFieldsValues {
  id?: string
  created_time?: string
  last_modified_time?: string
  deleted_time?: string
}

export type RecordStateType = 'read' | 'create' | 'update' | 'delete'

export interface IRecord {
  id: string
  fields: RecordFieldsValues
  created_time?: string
  last_modified_time?: string
  deleted_time?: string
  tableName: string
  getCurrentState(): RecordStateType
  getFieldValue(name: string): RecordFieldValue
  getMultipleLinkedRecordsValue(name: string): string[]
  setFieldValue(name: string, value: RecordFieldValue): void
  setCalculatedFieldValue(name: string, value: RecordFieldValue): void
  softDelete(): void
  validateFieldsPermissions(persistedValues: RecordFieldsValues): void
}
