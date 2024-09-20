import type { Record as Config } from '@adapter/api/configs/Expect/Record'
import { Record, type Services } from '@domain/entities/Expect/Record'
import { FilterMapper } from '@domain/entities/Filter'

export class RecordMapper {
  static toEntity = (config: Config, services: Services): Record => {
    const find = FilterMapper.toManyEntities(config.find)
    return new Record(config, services, { find })
  }
}
