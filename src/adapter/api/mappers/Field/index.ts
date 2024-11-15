import type { IField } from '@adapter/api/configs/Field'
import type { Field } from '@domain/entities/Field'
import { DateTimeFieldMapper } from './DateTimeMapper'
import { EmailFieldMapper } from './EmailMapper'
import { FormulaFieldMapper } from './FormulaMapper'
import { LongTextFieldMapper } from './LongTextMapper'
import { MultipleLinkedRecordFieldMapper } from './MultipleLinkedRecordMapper'
import { NumberFieldMapper } from './NumberMapper'
import { RollupFieldMapper } from './Rollup'
import { SingleLineTextFieldMapper } from './SingleLineTextMapper'
import { SingleLinkedRecordFieldMapper } from './SingleLinkedRecordMapper'
import { SingleSelectFieldMapper } from './SingleSelectMapper'

export class FieldMapper {
  static toEntity(config: IField, fields: IField[]): Field {
    const { field } = config
    if (field === 'SingleLineText') return SingleLineTextFieldMapper.toEntity(config)
    if (field === 'LongText') return LongTextFieldMapper.toEntity(config)
    if (field === 'DateTime') return DateTimeFieldMapper.toEntity(config)
    if (field === 'Email') return EmailFieldMapper.toEntity(config)
    if (field === 'Number') return NumberFieldMapper.toEntity(config)
    if (field === 'Formula') return FormulaFieldMapper.toEntity(config, fields)
    if (field === 'SingleSelect') return SingleSelectFieldMapper.toEntity(config)
    if (field === 'SingleLinkedRecord') return SingleLinkedRecordFieldMapper.toEntity(config)
    if (field === 'MultipleLinkedRecord') return MultipleLinkedRecordFieldMapper.toEntity(config)
    if (field === 'Rollup') return RollupFieldMapper.toEntity(config, fields)
    throw new Error(`FieldMapper: type ${field} not found`)
  }

  static toManyEntities(configs: IField[]): Field[] {
    return configs.map((config) => this.toEntity(config, configs))
  }
}
