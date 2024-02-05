import type { Field as FieldConfig } from '@adapter/api/configs/table/Field'
import type { Field } from '@domain/entities/table/Field'
import { Email } from '@domain/entities/table/Field/Email'
import { SingleLineText } from '@domain/entities/table/Field/SingleLineText'

export class FieldMapper {
  static toEntity(config: FieldConfig): Field {
    switch (config.type) {
      case 'SingleLineText':
        return new SingleLineText(config)
      case 'Email':
        return new Email(config)
      default:
        throw new Error('Unknown field type')
    }
  }

  static toManyEntities(configs: FieldConfig[]): Field[] {
    return configs.map((config) => this.toEntity(config))
  }
}
