import { SingleLineText } from '@domain/entities/Field/SingleLineText'
import type { SingleLineText as Config } from '@adapter/api/configs/Field/SingleLineText'

export class SingleLineTextMapper {
  static toEntity = (config: Config): SingleLineText => {
    return new SingleLineText(config)
  }

  static toManyEntities = (configs: Config[]): SingleLineText[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
