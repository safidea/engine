import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordData } from '../RecordData'

export class RecordToDelete extends BaseRecord {
  deleted_time: string

  constructor(data: RecordData, table: Table) {
    const deleted_time = new Date().toISOString()
    super({ ...data, deleted_time }, table)
    this.deleted_time = deleted_time
  }
}
