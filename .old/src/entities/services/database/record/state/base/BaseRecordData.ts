import * as t from 'io-ts'

export type BaseRecordFieldValue = string | number | boolean | undefined | string[]

export const BaseRecordFieldValue: t.Type<BaseRecordFieldValue> = t.union([
  t.string,
  t.number,
  t.boolean,
  t.undefined,
  t.array(t.string),
])

export type BaseRecordFields = { [key: string]: BaseRecordFieldValue }

export const BaseRecordFields: t.Type<BaseRecordFields> = t.record(t.string, BaseRecordFieldValue)

export interface BaseRecordData extends BaseRecordFields {
  readonly id: string
  readonly created_time: string
  readonly last_modified_time?: string
  readonly deleted_time?: string
}

export const BaseRecordData: t.Type<BaseRecordData> = t.intersection([
  BaseRecordFields,
  t.type({
    id: t.string,
    created_time: t.string,
  }),
  t.partial({
    last_modified_time: t.string,
    deleted_time: t.string,
  }),
])
