import type { Field } from '@domain/engine/table/field'
import type { DatabaseTableFieldDto } from '../dtos/DatabaseTableFieldDto'
import { Email } from '@domain/engine/table/field/Email'
import { SingleLineText } from '@domain/engine/table/field/SingleLineText'
import { DateTime } from '@domain/engine/table/field/DateTime'

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
