import { RollupField } from '@domain/entities/Field/Rollup'
import type { IRollupField } from '@adapter/api/configs/Field/Rollup'
import type { IField } from '@adapter/api/configs/Field'
import { FieldMapper } from '.'
import { ConfigError } from '@domain/entities/Error/Config'
import { MultipleLinkedRecordFieldMapper } from './MultipleLinkedRecordMapper'

export class RollupFieldMapper {
  static toEntity = (config: IRollupField, fields: IField[]): RollupField => {
    const { name, output, ...res } = config
    const outputEntity = FieldMapper.toEntity({ ...output, name }, fields)
    const multipleLinkedRecordField = fields.find(
      (field) => field.name === config.multipleLinkedRecord
    )
    if (!multipleLinkedRecordField || multipleLinkedRecordField.field !== 'MultipleLinkedRecord') {
      throw new ConfigError({
        entity: 'Field',
        name: config.name,
        message: `RollupMapper: Field ${config.multipleLinkedRecord} not found`,
      })
    }
    const multipleLinkedRecord = MultipleLinkedRecordFieldMapper.toEntity(multipleLinkedRecordField)
    return new RollupField({ ...res, name, output: outputEntity, multipleLinkedRecord })
  }

  static toManyEntities = (configs: IRollupField[], fields: IField[]): RollupField[] => {
    return configs.map((config) => this.toEntity(config, fields))
  }
}
