import { FormulaField } from '@domain/entities/Field/Formula'
import type { IFormulaField } from '@adapter/api/configs/Field/Formula'
import type { IField } from '@adapter/api/configs/Field'
import { FieldMapper } from '.'

export class FormulaFieldMapper {
  static toEntity = (config: IFormulaField, fields: IField[]): FormulaField => {
    const { name, output, ...res } = config
    const outputEntity = FieldMapper.toEntity({ ...output, name }, fields)
    return new FormulaField({ ...res, name, output: outputEntity })
  }

  static toManyEntities = (configs: IFormulaField[], fields: IField[]): FormulaField[] => {
    return configs.map((config) => this.toEntity(config, fields))
  }
}
