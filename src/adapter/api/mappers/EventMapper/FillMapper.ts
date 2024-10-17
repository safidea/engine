import { Fill } from '@domain/entities/Event/Fill'
import type { Fill as Config } from '@adapter/api/configs/Event/Fill'

export class FillMapper {
  static toEntity = (config: Config): Fill => {
    return new Fill(config)
  }

  static toManyEntities = (configs: Config[]): Fill[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
