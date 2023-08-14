import { Field } from '../table/Field'
import { Table } from '../table/Table'
import { v4 as uuidv4 } from 'uuid'
import { NumberField } from '../table/fields/NumberField'
import { Currency } from '../table/fields/Currency'
import { SingleLineText } from '../table/fields/SingleLineText'
import { LongText } from '../table/fields/LongText'
import { SingleSelect } from '../table/fields/SingleSelect'
import { Datetime } from '../table/fields/Datetime'
import { MultipleLinkedRecords } from '../table/fields/MultipleLinkedRecords'
import { Formula } from '../table/fields/Formula'
import { Rollup } from '../table/fields/Rollup'
import { Script } from './Script'

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

// TODO: transformer cette classe en structure abstraite et découper les états en classes de usecases (ReadRecord, CreateRecord, UpdateRecord, DeleteRecord)
export class Record {
  private readonly _id: string
  private readonly _created_time?: string
  private _last_modified_time?: string
  private _deleted_time?: string
  private readonly _fieldsValues: RecordFieldsValues

  constructor(
    recordData: RecordData,
    private _table: Table,
    private _state: RecordState = 'read',
    private _validation: boolean = true
  ) {
    const { id, created_time, deleted_time, last_modified_time, ...fieldsValues } = recordData
    switch (_state) {
      case 'read':
        if (!id) {
          throw new Error('read record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time
        this._deleted_time = deleted_time
        this._fieldsValues = fieldsValues
        break
      case 'create':
        this._id = id ?? uuidv4()
        this._created_time = created_time ?? new Date().toISOString()
        this._fieldsValues = this.validateFieldsValues(fieldsValues)
        break
      case 'update':
        if (!id) {
          throw new Error('updated record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time ?? new Date().toISOString()
        this._deleted_time = deleted_time
        this._fieldsValues = this.validateFieldsValues(fieldsValues)
        break
      case 'delete':
        if (!id) {
          throw new Error('deleted record must have an id')
        }
        this._id = id
        this._created_time = created_time
        this._last_modified_time = last_modified_time
        this._deleted_time = deleted_time ?? new Date().toISOString()
        this._fieldsValues = {}
        break
      default:
        throw new Error(`record state ${this._state} is not supported`)
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

  getFieldFromName(fieldName: string): Field {
    const field = this._table.fields.find((field) => field.name === fieldName)
    if (!field) {
      throw new Error(`field "${fieldName}" does not exist`)
    }
    return field
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this._fieldsValues[fieldName]
  }

  getMultipleLinkedRecordsValue(fieldName: string): string[] {
    const value = this.getFieldValue(fieldName)
    if (value === undefined) return []
    if (!Array.isArray(value)) {
      throw new Error(`field "${fieldName}" is not a multiple linked records field`)
    }
    return value
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getFieldFromName(fieldName)
    if (field instanceof Formula || field instanceof Rollup) {
      throw new Error(`field "${fieldName}" is a formula or a rollup`)
    }
    this._fieldsValues[fieldName] = this.validateFieldValue(field, value)
    this._state = this._state === 'read' ? 'update' : this._state
    this._last_modified_time = new Date().toISOString()
  }

  setCalculatedFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getFieldFromName(fieldName)
    if (!(field instanceof Formula || field instanceof Rollup)) {
      throw new Error(`field "${fieldName}" is not a formula or a rollup`)
    }
    this._fieldsValues[fieldName] = value
  }

  softDelete(): void {
    this._state = 'delete'
    this._deleted_time = new Date().toISOString()
  }

  validateFieldsValues(unknownValues: RecordFieldsValues): RecordFieldsValues {
    const fields = this._table.fields.filter(
      (field) => !['id', 'created_time', 'last_modified_time', 'deleted_time'].includes(field.name)
    )
    for (const field of Object.keys(unknownValues)) {
      this.getFieldFromName(field)
    }
    const validatedValues = fields.reduce((values: RecordFieldsValues, field) => {
      const validatedValue = this.validateFieldValue(field, unknownValues[field.name])
      if (validatedValue !== undefined) {
        values[field.name] = validatedValue
      }
      return values
    }, {})
    return validatedValues
  }

  validateFieldValue(field: Field, value: RecordFieldValue): RecordFieldValue {
    if (field instanceof Formula || field instanceof Rollup) return undefined

    if (!this._validation) return value

    if (value === undefined) {
      if (this._state === 'create') {
        if (field.default !== undefined) {
          return field.default
        }
        if (!field.optional) {
          throw new Error(`field "${field.name}" is required`)
        }
      }
      return undefined
    }

    if ((field instanceof NumberField || field instanceof Currency) && typeof value !== 'number') {
      value = Number(value)
      if (isNaN(value)) {
        throw new Error(`field "${field.name}" must be a number`)
      }
    }

    if (
      (field instanceof SingleLineText ||
        field instanceof LongText ||
        field instanceof SingleSelect) &&
      typeof value !== 'string'
    ) {
      value = String(value)
    }

    if (field instanceof Datetime) {
      const date = new Date(String(value))
      if (isNaN(date.getTime())) {
        throw new Error(`field "${field.name}" must be a valid date`)
      }
      value = date.toISOString()
    }

    if (field instanceof MultipleLinkedRecords) {
      if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof v !== 'string') {
            throw new Error(`field "${field.name}" must be an array of string`)
          }
        }
      } else {
        throw new Error(`field "${field.name}" must be an array`)
      }
    }

    return value
  }

  validateFieldsPermissions(persistedValues: RecordFieldsValues): void {
    const { fields } = this._table
    const context = fields.reduce((acc: RecordFieldsValues, field) => {
      acc[field.name] = persistedValues[field.name] ?? undefined
      return acc
    }, {})
    for (const field of fields) {
      const value = this.getFieldValue(field.name)
      if (value && this._state === 'update' && field.permissions.update) {
        if (typeof field.permissions.update === 'object') {
          const { formula } = field.permissions.update
          const allowed = new Script(formula, context).run()
          if (!allowed) {
            throw new Error(`field "${field.name}" cannot be updated`)
          }
        }
      }
    }
  }
}
