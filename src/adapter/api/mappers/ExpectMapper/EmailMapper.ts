import type { Email as Config } from '@adapter/api/configs/Expect/Email'
import { Email, type Services } from '@domain/entities/Expect/Email'
import { FilterMapper } from '@domain/entities/Filter'

export class EmailMapper {
  static toEntity = (config: Config, services: Services): Email => {
    const find = FilterMapper.toManyEntities(config.find)
    return new Email(config, services, { find })
  }
}
