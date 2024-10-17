import type { Email as Config } from '@adapter/api/configs/Expect/Email'
import { Email } from '@domain/entities/Expect/Email'
import { FilterMapper } from '@domain/entities/Filter'

export class EmailMapper {
  static toEntity = (config: Config): Email => {
    const find = FilterMapper.toManyEntities(config.find)
    return new Email(config, { find })
  }
}
