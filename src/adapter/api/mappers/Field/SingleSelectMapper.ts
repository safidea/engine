import { SingleSelectField } from '@domain/entities/Field/SingleSelect'
import type { ISingleSelectField } from '@adapter/api/configs/Field/SingleSelect'

export class SingleSelectFieldMapper {
  static toEntity = (config: ISingleSelectField): SingleSelectField => {
    return new SingleSelectField(config)
  }

  static toManyEntities = (configs: ISingleSelectField[]): SingleSelectField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
