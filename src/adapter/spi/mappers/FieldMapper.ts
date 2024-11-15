import type { Field } from '@domain/entities/Field'
import type { FieldDto } from '../dtos/FieldDto'
import { EmailField } from '@domain/entities/Field/Email'
import { SingleLineTextField } from '@domain/entities/Field/SingleLineText'
import { DateTimeField } from '@domain/entities/Field/DateTime'
import { LongTextField } from '@domain/entities/Field/LongText'
import { NumberField } from '@domain/entities/Field/Number'
import { FormulaField } from '@domain/entities/Field/Formula'
import { SingleSelectField } from '@domain/entities/Field/SingleSelect'
import { SingleLinkedRecordField } from '@domain/entities/Field/SingleLinkedRecord'
import { MultipleLinkedRecordField } from '@domain/entities/Field/MultipleLinkedRecord'
import { RollupField } from '@domain/entities/Field/Rollup'

export class FieldMapper {
  static toDto = (field: Field): FieldDto => {
    const fieldDto = {
      name: field.name,
      required: field.required,
      onMigration: field.onMigration,
    }
    if (
      field instanceof EmailField ||
      field instanceof SingleLineTextField ||
      field instanceof LongTextField
    ) {
      return {
        ...fieldDto,
        type: 'TEXT',
      }
    }
    if (field instanceof DateTimeField) {
      return {
        ...fieldDto,
        type: 'TIMESTAMP',
      }
    }
    if (field instanceof NumberField) {
      return {
        ...fieldDto,
        type: 'NUMERIC',
      }
    }
    if (field instanceof FormulaField) {
      return {
        ...fieldDto,
        type: FieldMapper.toDto(field.output).type,
        formula: field.formula,
      }
    }
    if (field instanceof RollupField) {
      return {
        ...fieldDto,
        type: FieldMapper.toDto(field.output).type,
        formula: field.formula,
        table: field.table,
        tableField: field.linkedRecordField,
      }
    }
    if (field instanceof SingleSelectField) {
      return {
        ...fieldDto,
        type: 'TEXT',
        options: field.options,
      }
    }
    if (field instanceof SingleLinkedRecordField) {
      return {
        ...fieldDto,
        type: 'TEXT',
        table: field.table,
      }
    }
    if (field instanceof MultipleLinkedRecordField) {
      return {
        ...fieldDto,
        type: 'TEXT[]',
        table: field.table,
      }
    }
    throw new Error('Field type not supported')
  }

  static toManyDto = (fields: Field[]): FieldDto[] => {
    return fields.map(FieldMapper.toDto)
  }
}
