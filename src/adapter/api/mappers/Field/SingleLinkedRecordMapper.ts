import { SingleLinkedRecordField } from '@domain/entities/Field/SingleLinkedRecord'
import type { ISingleLinkedRecordField } from '@adapter/api/configs/Field/SingleLinkedRecord'

export class SingleLinkedRecordFieldMapper {
  static toEntity = (config: ISingleLinkedRecordField): SingleLinkedRecordField => {
    return new SingleLinkedRecordField(config)
  }

  static toManyEntities = (configs: ISingleLinkedRecordField[]): SingleLinkedRecordField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
