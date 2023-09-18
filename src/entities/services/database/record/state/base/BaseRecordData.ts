import * as t from 'io-ts'

export const BaseRecordFieldValue = t.union([
  t.string,
  t.number,
  t.boolean,
  t.undefined,
  t.array(t.string),
])
export type BaseRecordFieldValue = t.TypeOf<typeof BaseRecordFieldValue>

export const BaseRecordFields = t.record(t.string, BaseRecordFieldValue)
export type BaseRecordFields = t.TypeOf<typeof BaseRecordFields>

export const BaseRecordData = t.intersection([
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
export type BaseRecordData = t.TypeOf<typeof BaseRecordData>
