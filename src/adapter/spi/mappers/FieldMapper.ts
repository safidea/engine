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

export class FieldMapper {
  static toDto = (field: Field): FieldDto => {
    if (field instanceof Email || field instanceof SingleLineText || field instanceof LongText) {
      return {
        name: field.name,
        type: 'TEXT',
        required: field.required,
      }
    }
    if (field instanceof DateTime) {
      return {
        name: field.name,
        type: 'TIMESTAMP',
        required: field.required,
      }
    }
    if (field instanceof Number) {
      return {
        name: field.name,
        type: 'NUMERIC',
        required: field.required,
      }
    }
    if (field instanceof Formula) {
      return {
        name: field.name,
        type: FieldMapper.toDto(field.output).type,
        formula: field.formula,
        required: field.required,
      }
    }
    if (field instanceof SingleSelect) {
      return {
        name: field.name,
        type: 'TEXT',
        options: field.options,
        required: field.required,
      }
    }
    if (field instanceof SingleLinkedRecord) {
      return {
        name: field.name,
        type: 'TEXT',
        table: field.table,
        required: field.required,
      }
    }
    if (field instanceof MultipleLinkedRecord) {
      return {
        name: field.name,
        type: 'TEXT[]',
        table: field.table,
        required: field.required,
      }
    }
    throw new Error('Field type not supported')
  }

  static toManyDto = (fields: Field[]): FieldDto[] => {
    return fields.map(FieldMapper.toDto)
  }
}
