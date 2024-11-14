import type { Record as Config } from '@adapter/api/configs/Expect/Record'
import { Record } from '@domain/entities/Expect/Record'
import { FilterMapper } from '@domain/entities/Filter'

export class RecordMapper {
  static toEntity = (config: Config): Record => {
    const find = FilterMapper.toEntity(config.find)
    return new Record(config, { find })
  }
}
