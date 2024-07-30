import { MultipleLinkedRecord } from '@domain/entities/Field/MultipleLinkedRecord'
import type { MultipleLinkedRecord as Config } from '@adapter/api/configs/Field/MultipleLinkedRecord'

export class MultipleLinkedRecordMapper {
  static toEntity = (config: Config): MultipleLinkedRecord => {
    return new MultipleLinkedRecord(config)
  }

  static toManyEntities = (configs: Config[]): MultipleLinkedRecord[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
