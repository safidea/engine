import { BaseRecordFields } from '../base/BaseRecordData'

export interface RecordToUpdateData extends BaseRecordFields {
  id: string
  last_modified_time: string
}
