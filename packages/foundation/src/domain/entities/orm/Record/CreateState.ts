import { v4 as uuidv4 } from 'uuid'
import { RecordState } from './RecordState'
import { Table } from '@domain/entities/table/Table'
import { RecordFieldsValues, RecordData, RecordFieldValue } from './IRecord'
import { Field } from '@domain/entities/table/Field'

export class CreateState extends RecordState {
  private readonly _created_time?: string
  private readonly _fieldsValues: RecordFieldsValues

  constructor(
    recordData: RecordData,
    table: Table,
    private validation: boolean
  ) {
    const { id = uuidv4(), created_time = new Date().toISOString(), ...fieldsValues } = recordData
    super(id, table)
    this._created_time = created_time
    this._fieldsValues =
      validation === true ? this.validateFieldsValues(fieldsValues) : fieldsValues
  }

  get created_time(): string | undefined {
    return this._created_time
  }

  get fields(): RecordFieldsValues {
    return this._fieldsValues
  }

  getCurrentState(): 'create' {
    return 'create'
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this._fieldsValues[fieldName]
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this._fieldsValues[fieldName] =
      this.validation === true ? this.validateFieldValue(field, value) : value
  }

  validateFieldValue(field: Field, value: RecordFieldValue): RecordFieldValue {
    if (value === undefined) {
      if (field.default !== undefined) {
        return field.default
      }
      if (!field.optional) {
        throw new Error(`field "${field.name}" is required`)
      }
      return undefined
    }
    return super.validateFieldValue(field, value)
  }
}
