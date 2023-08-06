import { Table } from '../table/Table'
import { v4 as uuidv4 } from 'uuid'

export type RecordFieldValue = string | number | boolean | undefined | string[]

export interface RecordFieldsValues {
  [key: string]: RecordFieldValue
}
export interface RecordData extends RecordFieldsValues {
  id?: string
  created_time?: string
  last_modified_time?: string
  deleted_time?: string
}

export type RecordState = 'read' | 'create' | 'update' | 'delete'

export class Record {
  private readonly _id: string
  private readonly _created_time?: string
  private readonly _last_modified_time?: string
  private readonly _deleted_time?: string
  private readonly _fieldsValues: RecordFieldsValues

  constructor(
    recordData: RecordData,
    private _table: Table,
    private _state: RecordState = 'read'
  ) {
    const { id, created_time, deleted_time, last_modified_time, ...fieldsValues } = recordData
    switch (_state) {
      case 'read':
        if (!id) {
          throw new Error('Record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time
        this._deleted_time = deleted_time
        break
      case 'create':
        this._id = uuidv4()
        this._created_time = new Date().toISOString()
        break
      case 'update':
        if (!id) {
          throw new Error('Updated record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = new Date().toISOString()
        this._deleted_time = deleted_time
        break
      case 'delete':
        if (!id) {
          throw new Error('Deleted record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time
        this._deleted_time = new Date().toISOString()
        break
      default:
        throw new Error('Invalid record state')
    }
    this._fieldsValues = this.validateFieldsValues(fieldsValues)
  }

  get id(): string {
    return this._id
  }

  get fields(): RecordFieldsValues {
    return this._fieldsValues
  }

  get created_time(): string | undefined {
    return this._created_time
  }

  get last_modified_time(): string | undefined {
    return this._last_modified_time
  }

  get deleted_time(): string | undefined {
    return this._deleted_time
  }

  get state(): RecordState {
    return this._state
  }

  get table(): Table {
    return this._table
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this._fieldsValues[fieldName]
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    this._fieldsValues[fieldName] = value
  }

  validateFieldsValues(fieldsValues: RecordFieldsValues): RecordFieldsValues {
    const validatedFieldsValues: RecordFieldsValues = {}
    return this._table.fields.reduce((values, field) => {
      if (['formula', 'rollup'].includes(field.type)) return values
      const value = fieldsValues[field.name]
      if (value === undefined) {
        if (this._state === 'create') {
          if (field.default !== undefined) {
            values[field.name] = field.default
          } else if (!field.optional) {
            throw new Error(`Field "${field.name}" is required`)
          }
        }
      } else {
        values[field.name] = value
      }
      return values
    }, validatedFieldsValues)
  }
}
