import type { IRecordExpect } from '@adapter/api/configs/Expect/Record'
import { RecordExpect } from '@domain/entities/Expect/Record'
import { FilterMapper } from '@domain/entities/Filter'

export class RecordExpectMapper {
  static toEntity = (config: IRecordExpect): RecordExpect => {
    const find = FilterMapper.toEntity(config.find)
    return new RecordExpect(config, { find })
  }
}
