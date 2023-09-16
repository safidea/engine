import { Table } from '@entities/app/table/Table'
import { BaseRecord } from '../base/BaseRecord'
import { RecordToDelete } from '../toDelete/RecordToDelete'
import { Scripter } from '@entities/services/scripter/Scripter'
import { Field } from '@entities/app/table/field/Field'
import { BaseRecordData, BaseRecordFieldValue, BaseRecordFields } from '../base/BaseRecordData'
import { RecordToUpdateData } from './RecordToUpdateData'

export class RecordToUpdate extends BaseRecord {
  last_modified_time: string

  constructor(
    data: BaseRecordData,
    table: Table,
    readonly updatedFields: BaseRecordFields
  ) {
    const last_modified_time = new Date().toISOString()
    super({ ...data, ...updatedFields, last_modified_time }, table, 'toUpdate')
    this.last_modified_time = last_modified_time
  }

  toUpdateData(): RecordToUpdateData {
    return {
      id: this.id,
      ...this.updatedFields,
      last_modified_time: this.last_modified_time,
    }
  }
  
  updateFieldValue(fieldName: string, value: BaseRecordFieldValue) {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this.validateFieldValue(field, value)
    this.fields[fieldName] = value
    this.updatedFields[fieldName] = value
    this.last_modified_time = new Date().toISOString()
  }

  softDelete(): RecordToDelete {
    return new RecordToDelete(this.data(), this.table)
  }

  validateFieldValue(field: Field, value: BaseRecordFieldValue): BaseRecordFieldValue {
    if (value === undefined) {
      return undefined
    }
    return super.validateFieldValue(field, value)
  }

  validateFieldsPermissions(persistedValues: BaseRecordFields): void {
    const { fields } = this.table
    const context = fields.reduce((acc: BaseRecordFields, field) => {
      acc[field.name] = persistedValues[field.name] ?? undefined
      return acc
    }, {})
    for (const field of fields) {
      const value = this.getFieldValue(field.name)
      if (value && field.permissions?.update) {
        if (typeof field.permissions?.update === 'object') {
          const { formula } = field.permissions.update
          const allowed = new Scripter(formula, context).run()
          if (!allowed) {
            throw new Error(`field "${field.name}" cannot be updated`)
          }
        }
      }
    }
  }
}
