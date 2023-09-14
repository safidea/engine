import { Table } from '@entities/app/table/Table'
import { BaseRecord } from './BaseRecord'
import { RecordToDelete } from './RecordToDelete'
import { Script } from '@entities/drivers/scripter/Script'
import { Field } from '@entities/app/table/field/Field'
import { RecordData, RecordFieldValue, RecordFields } from '../RecordData'

export class RecordToUpdate extends BaseRecord {
  last_modified_time?: string
  readonly fields: RecordFields

  constructor(recordData: RecordData, table: Table) {
    const { id, last_modified_time = new Date().toISOString(), ...fieldsValues } = recordData
    if (!id) {
      throw new Error('record to update must have an id')
    }
    super(id, table)
    this.last_modified_time = last_modified_time
    this.fields = this.validateFieldsValues(fieldsValues)
  }

  getCurrentState(): 'update' {
    return 'update'
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this.fields[fieldName]
  }

  updateFieldValue(fieldName: string, value: RecordFieldValue): RecordToUpdate {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this.fields[fieldName] = this.validateFieldValue(field, value)
    this.last_modified_time = new Date().toISOString()
    return this
  }

  softDelete(): RecordToDelete {
    return new RecordToDelete({ id: this.id }, this.table)
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

  data(): RecordData {
    return {
      id: this.id,
      ...this.fields,
      last_modified_time: this.last_modified_time,
    }
  }
}
