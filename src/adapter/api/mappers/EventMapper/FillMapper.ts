import { Fill, type Services } from '@domain/entities/Event/Fill'
import type { Fill as Config } from '@adapter/api/configs/Event/Fill'

export class FillMapper {
  static toEntity = (config: Config, services: Services): Fill => {
    return new Fill(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): Fill[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
