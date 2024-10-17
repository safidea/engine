import { WaitForText } from '@domain/entities/Event/WaitForText'
import type { WaitForText as Config } from '@adapter/api/configs/Event/WaitForText'

export class WaitForTextMapper {
  static toEntity = (config: Config): WaitForText => {
    return new WaitForText(config)
  }

  static toManyEntities = (configs: Config[]): WaitForText[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
