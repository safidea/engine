import * as t from 'io-ts'

export type RecordToDeleteData = {
  readonly id: string
  readonly deleted_time: string
}

export const RecordToDeleteData: t.Type<RecordToDeleteData> = t.type({
  id: t.string,
  deleted_time: t.string,
})
