import { v4 as uuidv4 } from 'uuid'
import { BaseRecord } from './BaseRecord'
import { Table } from '@entities/app/table/Table'
import { Field } from '@entities/app/table/field/Field'
import { RecordFields, RecordFieldValue } from '../RecordData'

export class RecordToCreate extends BaseRecord {
  constructor(
    fields: RecordFields,
    table: Table,
    private shouldValidate: boolean = false
  ) {
    super({ ...fields, id: uuidv4(), created_time: new Date().toISOString() }, table)
  }

  setFieldValue(fieldName: string, value: RecordFieldValue): void {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this.fields[fieldName] =
      this.shouldValidate === true ? this.validateFieldValue(field, value) : value
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
