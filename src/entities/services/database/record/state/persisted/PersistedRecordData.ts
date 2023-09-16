import { BaseRecordData, BaseRecordFieldValue } from "../base/BaseRecordData";

export type PersistedRecordDataWithLinkedRecordsData = { [key: string]: BaseRecordData[] | BaseRecordFieldValue }