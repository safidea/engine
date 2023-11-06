import * as t from 'io-ts'

export type UpdateRecordActionParams = {
  readonly name: string
  readonly type: 'update_record'
  readonly table: string
  readonly recordId: string
  readonly fields: { [key: string]: string }
}

export const UpdateRecordActionParams: t.Type<UpdateRecordActionParams> = t.type({
  name: t.string,
  type: t.literal('update_record'),
  table: t.string,
  recordId: t.string,
  fields: t.record(t.string, t.string),
})
