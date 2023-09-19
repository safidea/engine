import { Table } from '@entities/app/table/Table'
import { FormulaField } from '@entities/app/table/field/formula/FormulaField'
import { LongTextField } from '@entities/app/table/field/longText/LongTextField'
import { DatetimeField } from '@entities/app/table/field/datetime/DatetimeField'
import { SingleLineTextField } from '@entities/app/table/field/singleLineText/SingleLineTextField'
import { SingleSelectField } from '@entities/app/table/field/singleSelectField/SingleSelectField'
import { Field } from '@entities/app/table/field/Field'
import { CurrencyField } from '@entities/app/table/field/currency/CurrencyField'
import { MultipleLinkedRecordsField } from '@entities/app/table/field/multipleLinkedRecords/MultipleLinkedRecordsField'
import { NumberField } from '@entities/app/table/field/number/NumberField'
import { RollupField } from '@entities/app/table/field/rollup/RollupField'
import { RecordFields, RecordFieldValue } from '../../RecordData'
import { BaseRecordFields, BaseRecordData, BaseRecordFieldValue } from './BaseRecordData'
import { AutonumberField } from '@entities/app/table/field/autonumber/AutonumberField'

export class BaseRecord {
  readonly id: string
  readonly created_time: string
  readonly last_modified_time?: string
  readonly deleted_time?: string
  readonly fields: BaseRecordFields

  constructor(
    data: BaseRecordData,
    readonly table: Table,
    readonly state: 'persisted' | 'toCreate' | 'toUpdate' | 'toDelete'
  ) {
    const { id, created_time, deleted_time, last_modified_time, ...fields } = data
    this.id = id
    this.created_time = created_time
    this.last_modified_time = last_modified_time
    this.deleted_time = deleted_time
    this.fields = this.validateFieldsValues(fields)
  }

  getFieldValue(fieldName: string): BaseRecordFieldValue {
    return this.fields[fieldName]
  }

  data(): BaseRecordData {
    return {
      id: this.id,
      ...this.fields,
      created_time: this.created_time,
      last_modified_time: this.last_modified_time,
      deleted_time: this.deleted_time,
    }
  }

  getMultipleLinkedRecordsValue(fieldName: string): string[] {
    const value = this.getFieldValue(fieldName) ?? []
    if (!Array.isArray(value)) {
      throw new Error(`field "${fieldName}" is not a multiple linked records field`)
    }
    return value
  }

  protected getFieldFromName(fieldName: string): Field {
    const field = this.table.fields.find((field) => field.name === fieldName)
    if (!field) {
      throw new Error(`field "${fieldName}" does not exist`)
    }
    return field
  }

  protected getNonCalculatedFieldFromName(fieldName: string): Field {
    const field = this.getFieldFromName(fieldName)
    if (field instanceof FormulaField || field instanceof RollupField) {
      throw new Error(`field "${fieldName}" is a calculated field`)
    }
    return field
  }

  protected getCalculatedFieldFromName(fieldName: string): Field {
    const field = this.getFieldFromName(fieldName)
    if (!(field instanceof FormulaField || field instanceof RollupField)) {
      throw new Error(`field "${fieldName}" is not a calculated field`)
    }
    return field
  }

  protected getNonCalculatedCustomFields(): Field[] {
    return this.table.fields.filter(
      (field) =>
        !['id', 'created_time', 'last_modified_time', 'deleted_time'].includes(field.name) &&
        !(field instanceof FormulaField || field instanceof RollupField)
    )
  }

  protected validateFieldsValues(unknownValues: RecordFields): RecordFields {
    for (const field of Object.keys(unknownValues)) {
      this.getFieldFromName(field)
    }
    const fields = this.getNonCalculatedCustomFields()
    const validatedValues = fields.reduce((values: RecordFields, field) => {
      const validatedValue = this.validateFieldValue(field, unknownValues[field.name])
      if (validatedValue !== undefined) {
        values[field.name] = validatedValue
      }
      return values
    }, {})
    return validatedValues
  }

  protected validateFieldValue(field: Field, value: RecordFieldValue): RecordFieldValue {
    if (value === undefined) {
      if (!field.optional && !(field instanceof AutonumberField)) {
        throw new Error(`field "${field.name}" is required`)
      }
      return undefined
    }

    if (
      (field instanceof NumberField || field instanceof CurrencyField) &&
      typeof value !== 'number'
    ) {
      value = Number(value)
      if (isNaN(value)) {
        throw new Error(`field "${field.name}" must be a number`)
      }
    }

    if (
      (field instanceof SingleLineTextField ||
        field instanceof LongTextField ||
        field instanceof SingleSelectField) &&
      typeof value !== 'string'
    ) {
      value = String(value)
    }

    if (field instanceof DatetimeField) {
      const date = new Date(String(value))
      if (isNaN(date.getTime())) {
        throw new Error(`field "${field.name}" must be a valid date`)
      }
      value = date.toISOString()
    }

    if (field instanceof MultipleLinkedRecordsField) {
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
}
