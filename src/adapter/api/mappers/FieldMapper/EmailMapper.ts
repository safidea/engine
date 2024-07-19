import { Email } from '@domain/entities/Field/Email'
import type { Email as Config } from '@adapter/api/configs/Field/Email'

export class EmailMapper {
  static toEntity = (config: Config): Email => {
    return new Email(config)
  }

  static toManyEntities = (configs: Config[]): Email[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
