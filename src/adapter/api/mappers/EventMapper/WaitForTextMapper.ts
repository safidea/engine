import { WaitForText, type Services } from '@domain/entities/Event/WaitForText'
import type { WaitForText as Config } from '@adapter/api/configs/Event/WaitForText'

export class WaitForTextMapper {
  static toEntity = (config: Config, services: Services): WaitForText => {
    return new WaitForText(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): WaitForText[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
