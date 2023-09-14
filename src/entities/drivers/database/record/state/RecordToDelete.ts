import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordData } from '../RecordData'

export class RecordToDelete extends BaseRecord {
  constructor(data: RecordData, table: Table) {
    super({ ...data, deleted_time: new Date().toISOString() }, table)
  }
}
