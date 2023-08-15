import { Table } from '../../table/Table'
import {
  IRecord,
  RecordData,
  RecordFieldValue,
  RecordFieldsValues,
  RecordStateType,
} from './IRecord'
import { RecordState } from './RecordState'
import { ReadState } from './ReadState'
import { CreateState } from './CreateState'
import { UpdateState } from './UpdateState'
import { DeleteState } from './DeleteState'

export class Record implements IRecord {
  private state: RecordState

  constructor(
    recordData: RecordData,
    table: Table,
    state: RecordStateType = 'read',
    validation = true
  ) {
    switch (state) {
      case 'read':
        this.state = new ReadState(recordData, table)
        break
      case 'create':
        this.state = new CreateState(recordData, table, validation)
        break
      case 'update':
        this.state = new UpdateState(recordData, table)
        break
      case 'delete':
        this.state = new DeleteState(recordData, table)
        break
      default:
        throw new Error(`record state ${state} is not supported`)
    }
  }

  get id(): string {
    return this.state.id
  }

  get fields(): RecordFieldsValues {
    return this.state.fields
  }

  get created_time(): string | undefined {
    return this.state.created_time
  }

  get last_modified_time(): string | undefined {
    return this.state.last_modified_time
  }

  get deleted_time(): string | undefined {
    return this.state.deleted_time
  }

  get tableName(): string {
    return this.state.tableName
  }

  getCurrentState(): RecordStateType {
    return this.state.getCurrentState()
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this.state.getFieldValue(fieldName)
  }

  getMultipleLinkedRecordsValue(fieldName: string): string[] {
    return this.state.getMultipleLinkedRecordsValue(fieldName)
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    if (this.getCurrentState() === 'create') {
      this.state.setFieldValue(fieldName, value)
    } else {
      this.state = this.state.updateFieldValue(fieldName, value)
    }
  }

  setCalculatedFieldValue(fieldName: string, value: RecordFieldValue): void {
    return this.state.setCalculatedFieldValue(fieldName, value)
  }

  softDelete(): void {
    this.state = this.state.softDelete()
  }

  validateFieldsPermissions(persistedValues: RecordFieldsValues): void {
    return this.state.validateFieldsPermissions(persistedValues)
  }
}
