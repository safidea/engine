import type { Field as FieldConfig } from '@adapter/api/configs/table/field'
import type { Field } from '@domain/entities/table/field'
import { DateTime } from '@domain/entities/table/field/DateTime'
import { Email } from '@domain/entities/table/field/Email'
import { SingleLineText } from '@domain/entities/table/field/SingleLineText'

export class FieldMapper {
  static toEntity(config: FieldConfig): Field {
    switch (config.type) {
      case 'SingleLineText':
        return new SingleLineText(config)
      case 'Email':
        return new Email(config)
      case 'DateTime':
        return new DateTime(config)
      default:
        throw new Error('Unknown field type')
    }
  }

  static toManyEntities(configs: FieldConfig[]): Field[] {
    return configs.map((config) => this.toEntity(config))
  }
}
