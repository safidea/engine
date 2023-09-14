import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordToDelete } from './RecordToDelete'
import { Script } from '@entities/drivers/scripter/Script'
import { Field } from '@entities/app/table/field/Field'
import { RecordData, RecordFieldValue, RecordFields } from '../RecordData'

export interface RecordUpdatedData extends RecordFields {
  id: string
  last_modified_time: string
}

export class RecordToUpdate extends BaseRecord {
  last_modified_time: string

  constructor(
    data: RecordData,
    table: Table,
    readonly updatedFields: RecordFields
  ) {
    const last_modified_time = new Date().toISOString()
    super({ ...data, ...updatedFields, last_modified_time }, table)
    this.last_modified_time = last_modified_time
  }

  updatedData(): RecordUpdatedData {
    return {
      id: this.id,
      ...this.updatedFields,
      last_modified_time: this.last_modified_time,
    }
  }

  updateFieldValue(fieldName: string, value: RecordFieldValue) {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this.validateFieldValue(field, value)
    this.fields[fieldName] = value
    this.updatedFields[fieldName] = value
    this.last_modified_time = new Date().toISOString()
  }

  softDelete(): RecordToDelete {
    return new RecordToDelete(this.data(), this.table)
  }

  validateFieldValue(field: Field, value: RecordFieldValue): RecordFieldValue {
    if (value === undefined) {
      return undefined
    }
    return super.validateFieldValue(field, value)
  }

  validateFieldsPermissions(persistedValues: RecordFields): void {
    const { fields } = this.table
    const context = fields.reduce((acc: RecordFields, field) => {
      acc[field.name] = persistedValues[field.name] ?? undefined
      return acc
    }, {})
    for (const field of fields) {
      const value = this.getFieldValue(field.name)
      if (value && field.permissions?.update) {
        if (typeof field.permissions?.update === 'object') {
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
