import * as t from 'io-ts'

export const RecordToDeleteData = t.type({
  id: t.string,
  deleted_time: t.string,
})

export type RecordToDeleteData = t.TypeOf<typeof RecordToDeleteData>
