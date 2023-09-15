import * as t from 'io-ts'

export const FindRecordActionParams = t.type({
  name: t.string,
  type: t.literal('find_record'),
  table: t.string,
  recordId: t.string,
})

export type FindRecordActionParams = t.TypeOf<typeof FindRecordActionParams>
