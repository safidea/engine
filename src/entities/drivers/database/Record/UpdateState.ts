import { Table } from '@entities/app/table/Table'
import { RecordFieldsValues, RecordData, RecordFieldValue } from './IRecord'
import { RecordState } from './RecordState'
import { DeleteState } from './DeleteState'
import { Script } from '@entities/drivers/scripter/Script'
import { Field } from '@entities/app/table/Field'

export class UpdateState extends RecordState {
  private _last_modified_time?: string
  private readonly _fieldsValues: RecordFieldsValues

  constructor(recordData: RecordData, table: Table) {
    const { id, last_modified_time = new Date().toISOString(), ...fieldsValues } = recordData
    if (!id) {
      throw new Error('record state update must have an id')
    }
    super(id, table)
    this._last_modified_time = last_modified_time
    this._fieldsValues = this.validateFieldsValues(fieldsValues)
  }

  get fields(): RecordFieldsValues {
    return this._fieldsValues
  }

  get last_modified_time(): string | undefined {
    return this._last_modified_time
  }

  getCurrentState(): 'update' {
    return 'update'
  }

  getFieldValue(fieldName: string): RecordFieldValue {
    return this._fieldsValues[fieldName]
  }

  updateFieldValue(fieldName: string, value: RecordFieldValue): UpdateState {
    const field = this.getNonCalculatedFieldFromName(fieldName)
    this._fieldsValues[fieldName] = this.validateFieldValue(field, value)
    this._last_modified_time = new Date().toISOString()
    return this
  }

  softDelete(): DeleteState {
    return new DeleteState({ id: this.id }, this._table)
  }

  validateFieldValue(field: Field, value: RecordFieldValue): RecordFieldValue {
    if (value === undefined) {
      return undefined
    }
    return super.validateFieldValue(field, value)
  }

  validateFieldsPermissions(persistedValues: RecordFieldsValues): void {
    const { fields } = this._table
    const context = fields.reduce((acc: RecordFieldsValues, field) => {
      acc[field.name] = persistedValues[field.name] ?? undefined
      return acc
    }, {})
    for (const field of fields) {
      const value = this.getFieldValue(field.name)
      if (value && field.permissions.update) {
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
