import { SingleLineTextField } from '@domain/entities/Field/SingleLineText'
import type { ISingleLineTextField } from '@adapter/api/configs/Field/SingleLineText'

export class SingleLineTextFieldMapper {
  static toEntity = (config: ISingleLineTextField): SingleLineTextField => {
    return new SingleLineTextField(config)
  }

  static toManyEntities = (configs: ISingleLineTextField[]): SingleLineTextField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
