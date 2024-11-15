import { MultipleLinkedRecordField } from '@domain/entities/Field/MultipleLinkedRecord'
import type { IMultipleLinkedRecordField } from '@adapter/api/configs/Field/MultipleLinkedRecord'

export class MultipleLinkedRecordFieldMapper {
  static toEntity = (config: IMultipleLinkedRecordField): MultipleLinkedRecordField => {
    return new MultipleLinkedRecordField(config)
  }

  static toManyEntities = (configs: IMultipleLinkedRecordField[]): MultipleLinkedRecordField[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
