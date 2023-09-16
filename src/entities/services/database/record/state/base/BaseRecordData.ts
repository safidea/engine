export type BaseRecordFieldValue = string | number | boolean | undefined | string[]

export interface BaseRecordFields {
  [key: string]: BaseRecordFieldValue
}

export interface BaseRecordData extends BaseRecordFields {
  id: string
  created_time: string
  last_modified_time?: string
  deleted_time?: string
}

