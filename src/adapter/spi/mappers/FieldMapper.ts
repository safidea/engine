import type { Field } from '@domain/engine/table/field'
import type { FieldDto } from '../dtos/FieldDto'
import { Email } from '@domain/engine/table/field/Email'
import { SingleLineText } from '@domain/engine/table/field/SingleLineText'
import { DateTime } from '@domain/engine/table/field/DateTime'
import { LongText } from '@domain/engine/table/field/LongText'

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
    throw new Error('Field type not supported')
  }

  static toManyDto = (fields: Field[]): FieldDto[] => {
    return fields.map(FieldMapper.toDto)
  }
}
