import type { Field as FieldConfig } from '@adapter/api/configs/table/Field'
import type { Field } from '@domain/engine/table/field'
import { DateTime } from '@domain/engine/table/field/DateTime'
import { Email } from '@domain/engine/table/field/Email'
import { LongText } from '@domain/engine/table/field/LongText'
import { SingleLineText } from '@domain/engine/table/field/SingleLineText'

export class FieldMapper {
  static toEntity(config: FieldConfig): Field {
    switch (config.type) {
      case 'SingleLineText':
        return new SingleLineText(config)
      case 'Email':
        return new Email(config)
      case 'DateTime':
        return new DateTime(config)
      case 'LongText':
        return new LongText(config)
      default:
        throw new Error('Unknown field type')
    }
  }

  static toManyEntities(configs: FieldConfig[]): Field[] {
    return configs.map((config) => this.toEntity(config))
  }
}
