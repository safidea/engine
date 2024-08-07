import type { Field as Config } from '@adapter/api/configs/Field'
import type { Field } from '@domain/entities/Field'
import { SingleLineTextMapper } from './SingleLineTextMapper'
import { LongTextMapper } from './LongTextMapper'
import { DateTimeMapper } from './DateTimeMapper'
import { NumberMapper } from './NumberMapper'
import { EmailMapper } from './EmailMapper'
import { FormulaMapper } from './FormulaMapper'
import { SingleSelectMapper } from './SingleSelectMapper'
import { SingleLinkedRecordMapper } from './SingleLinkedRecordMapper'
import { MultipleLinkedRecordMapper } from './MultipleLinkedRecordMapper'
import { RollupMapper } from './Rollup'

export class FieldMapper {
  static toEntity(config: Config, fields: Config[]): Field {
    const { field } = config
    if (field === 'SingleLineText') return SingleLineTextMapper.toEntity(config)
    if (field === 'LongText') return LongTextMapper.toEntity(config)
    if (field === 'DateTime') return DateTimeMapper.toEntity(config)
    if (field === 'Email') return EmailMapper.toEntity(config)
    if (field === 'Number') return NumberMapper.toEntity(config)
    if (field === 'Formula') return FormulaMapper.toEntity(config, fields)
    if (field === 'SingleSelect') return SingleSelectMapper.toEntity(config)
    if (field === 'SingleLinkedRecord') return SingleLinkedRecordMapper.toEntity(config)
    if (field === 'MultipleLinkedRecord') return MultipleLinkedRecordMapper.toEntity(config)
    if (field === 'Rollup') return RollupMapper.toEntity(config, fields)
    throw new Error(`FieldMapper: type ${field} not found`)
  }

  static toManyEntities(configs: Config[]): Field[] {
    return configs.map((config) => this.toEntity(config, configs))
  }
}
