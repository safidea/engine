import type { Field } from '@domain/entities/Field'
import type { FieldDto } from '../dtos/FieldDto'
import { Email } from '@domain/entities/Field/Email'
import { SingleLineText } from '@domain/entities/Field/SingleLineText'
import { DateTime } from '@domain/entities/Field/DateTime'
import { LongText } from '@domain/entities/Field/LongText'
import { Number } from '@domain/entities/Field/Number'
import { Formula } from '@domain/entities/Field/Formula'
import { SingleSelect } from '@domain/entities/Field/SingleSelect'

export class FieldMapper {
  static toDto = (field: Field): FieldDto => {
    if (field instanceof Email || field instanceof SingleLineText || field instanceof LongText) {
      return {
        name: field.name,
        type: 'text',
      }
    }
    if (field instanceof DateTime) {
      return {
        name: field.name,
        type: 'timestamp',
      }
    }
    if (field instanceof Number) {
      return {
        name: field.name,
        type: 'numeric',
      }
    }
    if (field instanceof Formula) {
      return {
        name: field.name,
        type: FieldMapper.toDto(field.output).type,
        formula: field.formula,
      }
    }
    if (field instanceof SingleSelect) {
      return {
        name: field.name,
        type: 'text',
        options: field.options,
      }
    }
    throw new Error('Field type not supported')
  }

  static toManyDto = (fields: Field[]): FieldDto[] => {
    return fields.map(FieldMapper.toDto)
  }
}
