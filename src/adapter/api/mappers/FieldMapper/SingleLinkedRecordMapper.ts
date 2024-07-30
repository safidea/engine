import { SingleLinkedRecord } from '@domain/entities/Field/SingleLinkedRecord'
import type { SingleLinkedRecord as Config } from '@adapter/api/configs/Field/SingleLinkedRecord'

export class SingleLinkedRecordMapper {
  static toEntity = (config: Config): SingleLinkedRecord => {
    return new SingleLinkedRecord(config)
  }

  static toManyEntities = (configs: Config[]): SingleLinkedRecord[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
