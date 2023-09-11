import { Table } from '@entities/app/table/Table'
import { RecordData, RecordFieldValue, RecordFieldsValues } from './IRecord'
import { RecordState } from './RecordState'
import { DeleteState } from './DeleteState'
import { UpdateState } from './UpdateState'

export class ReadState extends RecordState {
  private readonly _created_time: string
  private readonly _last_modified_time?: string
  private readonly _deleted_time?: string
  private readonly _fieldsValues: RecordFieldsValues

  constructor(recordData: RecordData, table: Table) {
    const { id, created_time, deleted_time, last_modified_time, ...fieldsValues } = recordData
    if (!id) {
      throw new Error('record state read must have an id')
    }
    if (!created_time) {
      throw new Error('record state read must have a created_time')
    }
    super(id, table)
    this._created_time = created_time
    this._last_modified_time = last_modified_time
    this._deleted_time = deleted_time
    this._fieldsValues = fieldsValues
  }

  get fields(): RecordFieldsValues {
    return this._fieldsValues
  }

  get created_time(): string {
    return this._created_time
  }

  get last_modified_time(): string | undefined {
    return this._last_modified_time
  }

  get deleted_time(): string | undefined {
    return this._deleted_time
  }

  getCurrentState(): 'read' {
    return 'read'
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this._fieldsValues[fieldName]
  }

  updateFieldValue(fieldName: string, value: RecordFieldValue): UpdateState {
    return new UpdateState(
      {
        id: this.id,
        ...this.fields,
        [fieldName]: value,
      },
      this._table
    )
  }

  softDelete(): DeleteState {
    return new DeleteState({ id: this.id }, this._table)
  }

  setCalculatedFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getCalculatedFieldFromName(fieldName)
    this._fieldsValues[field.name] = value
  }

  toDto(): RecordData {
    return {
      id: this.id,
      ...this.fields,
      created_time: this.created_time,
      last_modified_time: this.last_modified_time,
      deleted_time: this.deleted_time,
    }
  }
}
