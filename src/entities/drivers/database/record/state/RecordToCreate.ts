import { v4 as uuidv4 } from 'uuid'
import { BaseRecord } from './BaseRecord'
import { Table } from '@entities/app/table/Table'
import { Field } from '@entities/app/table/field/Field'
import { RecordFields, RecordData, RecordFieldValue } from '../RecordData'

export class RecordToCreate extends BaseRecord {
  readonly created_time?: string
  readonly fields: RecordFields

  constructor(
    recordData: RecordData,
    table: Table,
    private validation: boolean
  ) {
    const { id = uuidv4(), created_time = new Date().toISOString(), ...fieldsValues } = recordData
    super(id, table)
    this.created_time = created_time
    this.fields = validation === true ? this.validateFieldsValues(fieldsValues) : fieldsValues
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this.fields[fieldName]
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this.fields[fieldName] =
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

  data(): RecordData {
    return {
      id: this.id,
      ...this.fields,
      created_time: this.created_time,
    }
  }
}
