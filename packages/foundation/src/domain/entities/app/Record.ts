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
  private _last_modified_time?: string
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
          throw new Error('Read record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time
        this._deleted_time = deleted_time
        this._fieldsValues = fieldsValues
        break
      case 'create':
        this._id = id ?? uuidv4()
        this._created_time = id ? new Date().toISOString() : undefined
        this._fieldsValues = id ? this.validateFieldsValues(fieldsValues) : fieldsValues
        break
      case 'update':
        if (!id) {
          throw new Error('Updated record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = new Date().toISOString()
        this._deleted_time = deleted_time
        this._fieldsValues = this.validateFieldsValues(fieldsValues)
        break
      case 'delete':
        if (!id) {
          throw new Error('Deleted record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time
        this._deleted_time = new Date().toISOString()
        this._fieldsValues = {}
        break
      default:
        throw new Error('Invalid record state')
    }
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

  get tableName(): string {
    return this._table.name
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this._fieldsValues[fieldName]
  }

  getMultipleLinkedRecordsValue(fieldName: string): string[] {
    const value = this.getFieldValue(fieldName)
    if (value === undefined) return []
    if (!Array.isArray(value)) {
      throw new Error(`Field "${fieldName}" is not a multiple linked records field`)
    }
    return value
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    this._fieldsValues[fieldName] = value
    this._state = this._state === 'read' ? 'update' : this._state
    this._last_modified_time = new Date().toISOString()
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
