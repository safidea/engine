import { Rollup } from '@domain/entities/Field/Rollup'
import type { Rollup as Config } from '@adapter/api/configs/Field/Rollup'
import type { Field as FieldConfig } from '@adapter/api/configs/Field'
import { FieldMapper } from '.'
import { ConfigError } from '@domain/entities/Error/Config'
import { MultipleLinkedRecordMapper } from './MultipleLinkedRecordMapper'

export class RollupMapper {
  static toEntity = (config: Config, fields: FieldConfig[]): Rollup => {
    const { name, output, ...res } = config
    const outputEntity = FieldMapper.toEntity({ ...output, name }, fields)
    const multipleLinkedRecordField = fields.find(
      (field) => field.name === config.multipleLinkedRecord
    )
    if (!multipleLinkedRecordField || multipleLinkedRecordField.field !== 'MultipleLinkedRecord') {
      throw new ConfigError({
        message: `RollupMapper: Field ${config.multipleLinkedRecord} not found`,
      })
    }
    const multipleLinkedRecord = MultipleLinkedRecordMapper.toEntity(multipleLinkedRecordField)
    return new Rollup({ ...res, name, output: outputEntity, multipleLinkedRecord })
  }

  static toManyEntities = (configs: Config[], fields: FieldConfig[]): Rollup[] => {
    return configs.map((config) => this.toEntity(config, fields))
  }
}
