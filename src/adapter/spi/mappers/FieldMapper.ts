import type { Field } from '@domain/entities/table/Field'
import type { DatabaseTableFieldDto } from '../dtos/DatabaseTableFieldDto'
import { Email } from '@domain/entities/table/Field/Email'
import { SingleLineText } from '@domain/entities/table/Field/SingleLineText'
import { DateTime } from '@domain/entities/table/Field/DateTime'

export class FieldMapper {
  static toDto = (field: Field): DatabaseTableFieldDto => {
    if (field instanceof Email || field instanceof SingleLineText) {
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

  static toManyDto = (fields: Field[]): DatabaseTableFieldDto[] => {
    return fields.map(FieldMapper.toDto)
  }
}
