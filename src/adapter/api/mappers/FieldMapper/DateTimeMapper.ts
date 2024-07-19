import { DateTime } from '@domain/entities/Field/DateTime'
import type { DateTime as Config } from '@adapter/api/configs/Field/DateTime'

export class DateTimeMapper {
  static toEntity = (config: Config): DateTime => {
    return new DateTime(config)
  }

  static toManyEntities = (configs: Config[]): DateTime[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
