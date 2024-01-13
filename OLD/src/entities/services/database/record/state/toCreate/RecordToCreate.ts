import { v4 as uuidv4 } from 'uuid'
import { BaseRecord } from '../base/BaseRecord'
import { Table } from '@entities/app/table/Table'
import { Field } from '@entities/app/table/field/Field'
import { BaseRecordFields, BaseRecordFieldValue } from '../base/BaseRecordData'

export class RecordToCreate extends BaseRecord {
  constructor(fields: BaseRecordFields, table: Table, skipValidation = false) {
    const id = fields.id ? String(fields.id) : uuidv4()
    const created_time = fields.created_time
      ? String(fields.created_time)
      : new Date().toISOString()
    super({ ...fields, id, created_time }, table, skipValidation)
  }

  setFieldValue(fieldName: string, value: BaseRecordFieldValue): void {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this.fields[fieldName] = this.validateFieldValue(field, value)
  }

  validateFieldValue(field: Field, value: BaseRecordFieldValue): BaseRecordFieldValue {
    if (this.skipValidation === true) {
      return value
    }
    if (value === undefined && field.default !== undefined) {
      return field.default
    }
    return super.validateFieldValue(field, value)
  }
}
