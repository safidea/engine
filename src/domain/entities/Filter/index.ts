import type { JSONSchema } from '@domain/services/SchemaValidator'
import {
  type Boolean,
  booleanSchemas,
  type BooleanConfig,
  isBooleanFilter,
  BooleanMapper,
} from './boolean'
import { DateMapper, dateSchemas, isDateFilter, type Date, type DateConfig } from './date'
import {
  isNumberFilter,
  type Number,
  type NumberConfig,
  NumberMapper,
  numberSchemas,
} from './number'
import {
  isSelectFilter,
  SelectMapper,
  selectSchemas,
  type Select,
  type SelectConfig,
} from './select'
import { isTextFilter, TextMapper, textSchemas, type Text, type TextConfig } from './text'
import { And, andSchema, type AndConfig } from './And'
import { Or, orSchema, type OrConfig } from './Or'

export type FilterWithOperatorConfig =
  | BooleanConfig
  | DateConfig
  | NumberConfig
  | SelectConfig
  | TextConfig

export type FilterConfig = AndConfig | OrConfig | FilterWithOperatorConfig

export type Filter = And | Or | Boolean | Date | Number | Select | Text

export const filterSchema: JSONSchema = {
  type: 'object',
  oneOf: [
    andSchema,
    orSchema,
    ...booleanSchemas,
    ...dateSchemas,
    ...numberSchemas,
    ...selectSchemas,
    ...textSchemas,
  ],
}

export class FilterMapper {
  static toEntity = (config: FilterConfig): Filter => {
    if ('and' in config) return new And(FilterMapper.toManyEntities(config.and))
    if ('or' in config) return new Or(FilterMapper.toManyEntities(config.or))
    const { operator } = config
    if (isBooleanFilter(config)) return BooleanMapper.toEntity(config)
    if (isDateFilter(config)) return DateMapper.toEntity(config)
    if (isNumberFilter(config)) return NumberMapper.toEntity(config)
    if (isSelectFilter(config)) return SelectMapper.toEntity(config)
    if (isTextFilter(config)) return TextMapper.toEntity(config)
    throw new Error(`Filter operator ${operator} not supported`)
  }

  static toManyEntities = (configs: FilterConfig[]): Filter[] => {
    return configs.map(this.toEntity)
  }
}
