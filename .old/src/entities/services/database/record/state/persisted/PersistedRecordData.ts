import { BaseRecordData, BaseRecordFieldValue } from '../base/BaseRecordData'

export const PersistedRecordData = BaseRecordData
export type PersistedRecordData = BaseRecordData

export type PersistedRecordDataWithLinkedRecordsData = {
  [key: string]: BaseRecordData[] | BaseRecordFieldValue
}
