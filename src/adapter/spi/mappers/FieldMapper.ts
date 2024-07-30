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

export class FieldMapper {
  static toDto = (field: Field): FieldDto => {
    if (field instanceof Email || field instanceof SingleLineText || field instanceof LongText) {
      return {
        name: field.name,
        type: 'text',
        required: field.required,
      }
    }
    if (field instanceof DateTime) {
      return {
        name: field.name,
        type: 'timestamp',
        required: field.required,
      }
    }
    if (field instanceof Number) {
      return {
        name: field.name,
        type: 'numeric',
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
        type: 'text',
        options: field.options,
        required: field.required,
      }
    }
    if (field instanceof SingleLinkedRecord) {
      return {
        name: field.name,
        type: 'text',
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
