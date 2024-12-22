import type { JSONSchema } from '@domain/services/SchemaValidator'
import {
  type BooleanFilter,
  booleanFilterSchemas,
  type BooleanFilterConfig,
  isBooleanFilter,
  BooleanFilterMapper,
} from './boolean'
import {
  DateFilterMapper,
  dateFilterSchemas,
  isDateFilter,
  type DateFilter,
  type DateFilterConfig,
} from './date'
import {
  isNumberFilter,
  type NumberFilter,
  type NumberFilterConfig,
  NumberFilterMapper,
  numberFilterSchemas,
} from './number'
import {
  isSelectFilter,
  SelectFilterMapper,
  selectFilterSchemas,
  type SelectFilter,
  type SelectFilterConfig,
} from './select'
import {
  isTextFilter,
  TextFilterMapper,
  textFilterSchemas,
  type TextFilter,
  type TextFilterConfig,
} from './text'
import { AndFilter, andFilterSchema, type AndFilterConfig } from './And'
import { OrFilter, orFilterSchema, type OrFilterConfig } from './Or'

export type FilterWithOperatorConfig =
  | BooleanFilterConfig
  | DateFilterConfig
  | NumberFilterConfig
  | SelectFilterConfig
  | TextFilterConfig

export type FilterConfig = AndFilterConfig | OrFilterConfig | FilterWithOperatorConfig

export type Filter =
  | AndFilter
  | OrFilter
  | BooleanFilter
  | DateFilter
  | NumberFilter
  | SelectFilter
  | TextFilter

export const filterSchema: JSONSchema = {
  type: 'object',
  oneOf: [
    andFilterSchema,
    orFilterSchema,
    ...booleanFilterSchemas,
    ...dateFilterSchemas,
    ...numberFilterSchemas,
    ...selectFilterSchemas,
    ...textFilterSchemas,
  ],
}

export class FilterMapper {
  static toEntity = (config: FilterConfig): Filter => {
    if ('and' in config) return new AndFilter(FilterMapper.toManyEntities(config.and))
    if ('or' in config) return new OrFilter(FilterMapper.toManyEntities(config.or))
    const { operator } = config
    if (isBooleanFilter(config)) return BooleanFilterMapper.toEntity(config)
    if (isDateFilter(config)) return DateFilterMapper.toEntity(config)
    if (isNumberFilter(config)) return NumberFilterMapper.toEntity(config)
    if (isSelectFilter(config)) return SelectFilterMapper.toEntity(config)
    if (isTextFilter(config)) return TextFilterMapper.toEntity(config)
    throw new Error(`Filter operator ${operator} not supported`)
  }

  static toManyEntities = (configs: FilterConfig[]): Filter[] => {
    return configs.map(this.toEntity)
  }
}
