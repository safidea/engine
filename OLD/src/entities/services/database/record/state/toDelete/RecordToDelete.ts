import { Table } from '@entities/app/table/Table'
import { BaseRecord } from '../base/BaseRecord'
import { BaseRecordData } from '../base/BaseRecordData'
import { RecordToDeleteData } from './RecordToDeleteData'

export class RecordToDelete extends BaseRecord {
  deleted_time: string

  constructor(data: BaseRecordData, table: Table) {
    const deleted_time = new Date().toISOString()
    super({ ...data, deleted_time }, table)
    this.deleted_time = deleted_time
  }

  toDeleteData(): RecordToDeleteData {
    return {
      id: this.id,
      deleted_time: this.deleted_time,
    }
  }
}
