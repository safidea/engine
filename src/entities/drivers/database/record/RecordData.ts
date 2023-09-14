export type RecordFieldValue = string | number | boolean | undefined | string[]

export interface RecordFields {
  [key: string]: RecordFieldValue
}

export interface RecordData extends RecordFields {
  id: string
  created_time: string
  last_modified_time?: string
  deleted_time?: string
}
