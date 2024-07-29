import { Formula } from '@domain/entities/Field/Formula'
import type { Formula as Config } from '@adapter/api/configs/Field/Formula'
import { FieldMapper } from '.'

export class FormulaMapper {
  static toEntity = (config: Config): Formula => {
    const { name, output, ...res } = config
    const outputEntity = FieldMapper.toEntity({ ...output, name })
    return new Formula({ ...res, name, output: outputEntity })
  }

  static toManyEntities = (configs: Config[]): Formula[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
