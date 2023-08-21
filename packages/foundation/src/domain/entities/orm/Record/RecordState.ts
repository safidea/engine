/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from '@domain/entities/table/Table'
import { IRecord, RecordFieldValue, RecordFieldsValues, RecordStateType } from './IRecord'
import { Field } from '@domain/entities/table/Field'
import { Formula } from '@domain/entities/table/fields/Formula'
import { Rollup } from '@domain/entities/table/fields/Rollup'
import { LongText } from '@domain/entities/table/fields/LongText'
import { Datetime } from '@domain/entities/table/fields/Datetime'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { NumberField } from '@domain/entities/table/fields/NumberField'
import { SingleLineText } from '@domain/entities/table/fields/SingleLineText'
import { SingleSelect } from '@domain/entities/table/fields/SingleSelect'
import { Currency } from '@domain/entities/table/fields/Currency'
import { DeleteState } from './DeleteState'
import { UpdateState } from './UpdateState'
import { Record } from './index'

export abstract class RecordState implements IRecord {
  constructor(
    private _id: string,
    protected _table: Table
  ) {}

  get id(): string {
    return this._id
  }

  get fields(): RecordFieldsValues {
    throw new Error('Invalid Operation: Cannot perform task fields in current state')
  }

  get created_time(): string | undefined {
    throw new Error('Invalid Operation: Cannot perform task created_time in current state')
  }

  get last_modified_time(): string | undefined {
    throw new Error('Invalid Operation: Cannot perform task last_modified_time in current state')
  }

  get deleted_time(): string | undefined {
    throw new Error('Invalid Operation: Cannot perform task deleted_time in current state')
  }

  get tableName(): string {
    return this._table.name
  }

  getCurrentState(): RecordStateType {
    throw new Error('Invalid Operation: Cannot perform task getCurrentState in current state')
  }

  protected getFieldFromName(fieldName: string): Field {
    const field = this._table.fields.find((field) => field.name === fieldName)
    if (!field) {
      throw new Error(`field "${fieldName}" does not exist`)
    }
    return field
  }

  protected getNonCalculatedFieldFromName(fieldName: string): Field {
    const field = this.getFieldFromName(fieldName)
    if (field instanceof Formula || field instanceof Rollup) {
      throw new Error(`field "${fieldName}" is a calculated field`)
    }
    return field
  }

  protected getCalculatedFieldFromName(fieldName: string): Field {
    const field = this.getFieldFromName(fieldName)
    if (!(field instanceof Formula || field instanceof Rollup)) {
      throw new Error(`field "${fieldName}" is not a calculated field`)
    }
    return field
  }

  protected getNonCalculatedCustomFields(): Field[] {
    return this._table.fields.filter(
      (field) =>
        !['id', 'created_time', 'last_modified_time', 'deleted_time'].includes(field.name) &&
        !(field instanceof Formula || field instanceof Rollup)
    )
  }

  getFieldValue(name: string): RecordFieldValue {
    throw new Error('Invalid Operation: Cannot perform task getFieldValue in current state')
  }

  getMultipleLinkedRecordsValue(fieldName: string): string[] {
    const value = this.getFieldValue(fieldName) ?? []
    if (!Array.isArray(value)) {
      throw new Error(`field "${fieldName}" is not a multiple linked records field`)
    }
    return value
  }

  setFieldValue(name: string, value: RecordFieldValue): void {
    throw new Error('Invalid Operation: Cannot perform task setFieldValue in current state')
  }

  updateFieldValue(name: string, value: RecordFieldValue): UpdateState {
    throw new Error('Invalid Operation: Cannot perform task updateFieldValue in current state')
  }

  setCalculatedFieldValue(name: string, value: RecordFieldValue): void {
    throw new Error(
      'Invalid Operation: Cannot perform task setCalculatedFieldValue in current state'
    )
  }

  softDelete(): DeleteState {
    throw new Error('Invalid Operation: Cannot perform task softDelete in current state')
  }

  protected validateFieldsValues(unknownValues: RecordFieldsValues): RecordFieldsValues {
    for (const field of Object.keys(unknownValues)) {
      this.getFieldFromName(field)
    }
    const fields = this.getNonCalculatedCustomFields()
    const validatedValues = fields.reduce((values: RecordFieldsValues, field) => {
      const validatedValue = this.validateFieldValue(field, unknownValues[field.name])
      if (validatedValue !== undefined) {
        values[field.name] = validatedValue
      }
      return values
    }, {})
    return validatedValues
  }

  protected validateFieldValue(field: Field, value: RecordFieldValue): RecordFieldValue {
    if ((field instanceof NumberField || field instanceof Currency) && typeof value !== 'number') {
      value = Number(value)
      if (isNaN(value)) {
        throw new Error(`field "${field.name}" must be a number`)
      }
    }

    if (
      (field instanceof SingleLineText ||
        field instanceof LongText ||
        field instanceof SingleSelect) &&
      typeof value !== 'string'
    ) {
      value = String(value)
    }

    if (field instanceof Datetime) {
      const date = new Date(String(value))
      if (isNaN(date.getTime())) {
        throw new Error(`field "${field.name}" must be a valid date`)
      }
      value = date.toISOString()
    }

    if (field instanceof MultipleLinkedRecords) {
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

  validateFieldsPermissions(persistedValues: RecordFieldsValues): void {
    throw new Error(
      'Invalid Operation: Cannot perform task validateFieldsPermissions in current state'
    )
  }

  toDto(): RecordFieldsValues {
    throw new Error('Invalid Operation: Cannot perform task toDto in current state')
  }
}
