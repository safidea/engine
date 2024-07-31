import { Formula } from '@domain/entities/Field/Formula'
import type { Formula as Config } from '@adapter/api/configs/Field/Formula'
import type { Field as FieldConfig } from '@adapter/api/configs/Field'
import { FieldMapper } from '.'

export class FormulaMapper {
  static toEntity = (config: Config, fields: FieldConfig[]): Formula => {
    const { name, output, ...res } = config
    const outputEntity = FieldMapper.toEntity({ ...output, name }, fields)
    return new Formula({ ...res, name, output: outputEntity })
  }

  static toManyEntities = (configs: Config[], fields: FieldConfig[]): Formula[] => {
    return configs.map((config) => this.toEntity(config, fields))
  }
}
