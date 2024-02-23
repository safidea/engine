import * as t from 'io-ts'

export type FindRecordActionParams = {
  readonly name: string
  readonly type: 'find_record'
  readonly table: string
  readonly recordId: string
}

export const FindRecordActionParams: t.Type<FindRecordActionParams> = t.type({
  name: t.string,
  type: t.literal('find_record'),
  table: t.string,
  recordId: t.string,
})
