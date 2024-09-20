import { ClickInEmail, type Services } from '@domain/entities/Event/ClickInEmail'
import type { ClickInEmail as Config } from '@adapter/api/configs/Event/ClickInEmail'
import { FilterMapper } from '@domain/entities/Filter'

export class ClickInEmailMapper {
  static toEntity = (config: Config, services: Services): ClickInEmail => {
    const find = FilterMapper.toManyEntities(config.find)
    return new ClickInEmail(config, services, { find })
  }

  static toManyEntities = (configs: Config[], services: Services): ClickInEmail[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
