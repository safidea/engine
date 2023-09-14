import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordData } from '../RecordData'

export class RecordToDelete extends BaseRecord {
  readonly deleted_time: string

  constructor(recordData: RecordData, table: Table) {
    const { id } = recordData
    if (!id) {
      throw new Error('record to delete must have an id')
    }
    super(id, table)
    this.deleted_time = new Date().toISOString()
  }

  data(): RecordData {
    return {
      id: this.id,
      deleted_time: this.deleted_time,
    }
  }
}
