import { LongText } from '@domain/entities/Field/LongText'
import type { LongText as Config } from '@adapter/api/configs/Field/LongText'

export class LongTextMapper {
  static toEntity = (config: Config): LongText => {
    return new LongText(config)
  }

  static toManyEntities = (configs: Config[]): LongText[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
