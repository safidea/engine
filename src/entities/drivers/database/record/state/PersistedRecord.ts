import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordToDelete } from './RecordToDelete'
import { RecordToUpdate } from './RecordToUpdate'
import { RecordData, RecordFieldValue } from '../RecordData'

export class PersistedRecord extends BaseRecord {
  constructor(data: RecordData, table: Table) {
    super(data, table)
  }

  updateFieldValue(fieldName: string, value: RecordFieldValue): RecordToUpdate {
    return new RecordToUpdate(this.data(), this.table, { [fieldName]: value })
  }

  softDelete(): RecordToDelete {
    return new RecordToDelete(this.data(), this.table)
  }

  setCalculatedFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getCalculatedFieldFromName(fieldName)
    this.fields[field.name] = value
  }
}
