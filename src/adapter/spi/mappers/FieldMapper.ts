import type { Field } from '@domain/entities/Field'
import type { FieldDto } from '../dtos/FieldDto'
import { Email } from '@domain/entities/Field/Email'
import { SingleLineText } from '@domain/entities/Field/SingleLineText'
import { DateTime } from '@domain/entities/Field/DateTime'
import { LongText } from '@domain/entities/Field/LongText'
import { Number } from '@domain/entities/Field/Number'
import { Formula } from '@domain/entities/Field/Formula'
import { SingleSelect } from '@domain/entities/Field/SingleSelect'
import { SingleLinkedRecord } from '@domain/entities/Field/SingleLinkedRecord'
import { MultipleLinkedRecord } from '@domain/entities/Field/MultipleLinkedRecord'
import { Rollup } from '@domain/entities/Field/Rollup'

export class FieldMapper {
  static toDto = (field: Field): FieldDto => {
    const fieldDto = {
      name: field.name,
      required: field.required,
    }
    if (field instanceof Email || field instanceof SingleLineText || field instanceof LongText) {
      return {
        ...fieldDto,
        type: 'TEXT',
      }
    }
    if (field instanceof DateTime) {
      return {
        ...fieldDto,
        type: 'TIMESTAMP',
      }
    }
    if (field instanceof Number) {
      return {
        ...fieldDto,
        type: 'NUMERIC',
      }
    }
    if (field instanceof Formula) {
      return {
        ...fieldDto,
        type: FieldMapper.toDto(field.output).type,
        formula: field.formula,
      }
    }
    if (field instanceof Rollup) {
      return {
        ...fieldDto,
        type: FieldMapper.toDto(field.output).type,
        formula: field.formula,
        table: field.table,
        tableField: field.linkedRecordField,
      }
    }
    if (field instanceof SingleSelect) {
      return {
        ...fieldDto,
        type: 'TEXT',
        options: field.options,
      }
    }
    if (field instanceof SingleLinkedRecord) {
      return {
        ...fieldDto,
        type: 'TEXT',
        table: field.table,
      }
    }
    if (field instanceof MultipleLinkedRecord) {
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
