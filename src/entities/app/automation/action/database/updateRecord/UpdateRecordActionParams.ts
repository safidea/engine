import * as t from 'io-ts'

export const UpdateRecordActionParams = t.type({
  name: t.string,
  type: t.literal('update_record'),
  table: t.string,
  recordId: t.string,
  fields: t.record(t.string, t.string),
})

export type UpdateRecordActionParams = t.TypeOf<typeof UpdateRecordActionParams>
