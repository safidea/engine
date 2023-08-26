import { Table } from '@domain/entities/table/Table'
import { RecordState } from './RecordState'
import { RecordData } from './IRecord'

export class DeleteState extends RecordState {
  private _deleted_time: string

  constructor(recordData: RecordData, table: Table) {
    const { id } = recordData
    if (!id) {
      throw new Error('record state delete must have an id')
    }
    super(id, table)
    this._deleted_time = new Date().toISOString()
  }

  get deleted_time(): string {
    return this._deleted_time
  }

  getCurrentState(): 'delete' {
    return 'delete'
  }
}
