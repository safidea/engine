import * as t from 'io-ts'
import { BaseRecordFields } from '../base/BaseRecordData'

export interface RecordToUpdateData extends BaseRecordFields {
  readonly id: string
  readonly last_modified_time: string
}

export const RecordToUpdateData: t.Type<RecordToUpdateData> = t.intersection([
  BaseRecordFields,
  t.type({
    id: t.string,
    last_modified_time: t.string,
  }),
])
