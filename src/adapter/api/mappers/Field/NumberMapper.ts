import { NumberField } from '@domain/entities/Field/Number'
import type { INumberField } from '@adapter/api/configs/Field/Number'

export class NumberFieldMapper {
  static toEntity = (config: INumberField): NumberField => {
    return new NumberField(config)
  }

  static toManyEntities = (configs: INumberField[]): NumberField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
