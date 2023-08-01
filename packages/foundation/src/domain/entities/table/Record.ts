import { Field } from './Field'

export interface FieldsValues {
  [key: string]: string | number | boolean | undefined | string[]
}

export type RecordStatus = 'created' | 'updated' | 'deleted'

export class Record {
  private readonly _id: string
  private readonly _created_time?: string
  private readonly _last_modified_time?: string
  private readonly _deleted_time?: string
  private readonly _fieldsValues: FieldsValues

  constructor(
    private readonly _table: string,
    fieldValues: FieldsValues,
    fields: Field[],
    private readonly _status: RecordStatus = 'created'
  ) {
    const { id, created_time, last_modified_time, deleted_time, ...fieldsValues } = fieldValues
    if (!id) {
      throw new Error('Record must have an id')
    }
    this._id = String(id)
    this._created_time = created_time ? String(created_time) : undefined
    this._last_modified_time = last_modified_time ? String(last_modified_time) : undefined
    this._deleted_time = deleted_time ? String(deleted_time) : undefined
    this._fieldsValues = fields.reduce((values, field) => {
      if (['formula', 'rollup'].includes(field.type)) return values
      const value = fieldsValues[field.name]
      if (value === undefined) {
        if (_status === 'created') {
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
    }, {} as FieldsValues)
  }

  get id(): string {
    return this._id
  }

  get fields(): FieldsValues {
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

  get table(): string {
    return this._table
  }

  get status(): RecordStatus {
    return this._status
  }
}
