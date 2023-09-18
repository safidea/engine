import * as t from 'io-ts'
import { BaseRecordFields } from '../base/BaseRecordData'

export const RecordToUpdateData = t.intersection([
  BaseRecordFields,
  t.type({
    id: t.string,
    last_modified_time: t.string,
  }),
])

export type RecordToUpdateData = t.TypeOf<typeof RecordToUpdateData>
