import { ClickInEmail } from '@domain/entities/Event/ClickInEmail'
import type { ClickInEmail as Config } from '@adapter/api/configs/Event/ClickInEmail'
import { FilterMapper } from '@domain/entities/Filter'

export class ClickInEmailMapper {
  static toEntity = (config: Config): ClickInEmail => {
    const find = FilterMapper.toManyEntities(config.find)
    return new ClickInEmail(config, { find })
  }

  static toManyEntities = (configs: Config[]): ClickInEmail[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
