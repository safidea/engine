import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordToDelete } from './RecordToDelete'
import { RecordToUpdate } from './RecordToUpdate'
import { RecordData, RecordFieldValue, RecordFields } from '../RecordData'

export class PersistedRecord extends BaseRecord {
  readonly created_time: string
  readonly last_modified_time?: string
  readonly deleted_time?: string
  readonly fields: RecordFields

  constructor(data: RecordData, table: Table) {
    const { id, created_time, deleted_time, last_modified_time, ...fields } = data
    if (!id) {
      throw new Error('record state read must have an id')
    }
    if (!created_time) {
      throw new Error('record state read must have a created_time')
    }
    super(id, table)
    this.created_time = created_time
    this.last_modified_time = last_modified_time
    this.deleted_time = deleted_time
    this.fields = fields
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this.fields[fieldName]
  }

  updateFieldValue(fieldName: string, value: RecordFieldValue): RecordToUpdate {
    return new RecordToUpdate(
      {
        id: this.id,
        ...this.fields,
        [fieldName]: value,
      },
      this.table
    )
  }

  softDelete(): RecordToDelete {
    return new RecordToDelete({ id: this.id }, this.table)
  }

  setCalculatedFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getCalculatedFieldFromName(fieldName)
    this.fields[field.name] = value
  }

  data(): RecordData {
    return {
      id: this.id,
      ...this.fields,
      created_time: this.created_time,
      last_modified_time: this.last_modified_time,
      deleted_time: this.deleted_time,
    }
  }
}
