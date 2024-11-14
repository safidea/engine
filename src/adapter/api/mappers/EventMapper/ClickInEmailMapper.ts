import { ClickInEmail } from '@domain/entities/Event/ClickInEmail'
import type { ClickInEmail as Config } from '@adapter/api/configs/Event/ClickInEmail'

export class ClickInEmailMapper {
  static toEntity = (config: Config): ClickInEmail => {
    return new ClickInEmail(config)
  }

  static toManyEntities = (configs: Config[]): ClickInEmail[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
