import { Table } from '@entities/app/table/Table'
import { BaseRecord } from '../base/BaseRecord'
import { RecordToDelete } from '../toDelete/RecordToDelete'
import { RecordToUpdate } from '../toUpdate/RecordToUpdate'
import { BaseRecordData, BaseRecordFieldValue } from '../base/BaseRecordData'

export class PersistedRecord extends BaseRecord {
  constructor(data: BaseRecordData, table: Table) {
    super(data, table, 'persisted')
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
}
