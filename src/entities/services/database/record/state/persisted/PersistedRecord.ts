import { Table } from '@entities/app/table/Table'
import { BaseRecord } from '../base/BaseRecord'
import { RecordToDelete } from '../toDelete/RecordToDelete'
import { RecordToUpdate } from '../toUpdate/RecordToUpdate'
import { BaseRecordData, BaseRecordFieldValue } from '../base/BaseRecordData'
import { PersistedRecordDataWithLinkedRecordsData } from './PersistedRecordData'

export class PersistedRecord extends BaseRecord {
  multipleLinkedRecordsFieldsData: { [key: string]: BaseRecordData[] } = {}

  constructor(data: BaseRecordData, table: Table) {
    console.log('data', JSON.stringify(data))
    super(data, table, true)
  }

  dataWithLinkedRecordsData(): PersistedRecordDataWithLinkedRecordsData {
    return {
      ...this.data(),
      ...this.multipleLinkedRecordsFieldsData,
    }
  }

  updateFieldValue(fieldName: string, value: BaseRecordFieldValue): RecordToUpdate {
    return new RecordToUpdate(this.data(), this.table, { [fieldName]: value })
  }

  softDelete(): RecordToDelete {
    return new RecordToDelete(this.data(), this.table)
  }

  setCalculatedFieldValue(fieldName: string, value: BaseRecordFieldValue): void {
    const field = this.getCalculatedFieldFromName(fieldName)
    this.fields[field.name] = value
  }

  setMultipleLinkedRecordsFieldsData(fieldName: string, data: BaseRecordData[]): void {
    const field = this.getFieldFromName(fieldName)
    this.multipleLinkedRecordsFieldsData[field.name] = data
  }
}
