import { Number as Number_ } from '@domain/entities/Field/Number'
import type { Number as Config } from '@adapter/api/configs/Field/Number'

export class NumberMapper {
  static toEntity = (config: Config): Number_ => {
    return new Number_(config)
  }

  static toManyEntities = (configs: Config[]): Number_[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
