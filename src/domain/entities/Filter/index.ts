import { IsAnyOf, isAnyOfSchema, type Config as IsAnyOfConfig } from './IsAnyOf'
import { Is, isSchema, type Config as IsConfig } from './Is'
import type { JSONSchema } from '@domain/services/SchemaValidator'

export type Config = IsAnyOfConfig | IsConfig

export type Filter = Is | IsAnyOf

export const schema: JSONSchema = {
  type: 'array',
  items: {
    oneOf: [isSchema, isAnyOfSchema],
  },
}

export class FilterMapper {
  static toEntity = (config: Config): Filter => {
    const { operator } = config
    if (operator === 'is') return new Is(config)
    if (operator === 'isAnyOf') return new IsAnyOf(config)
    throw new Error(`Filter: operator ${operator} not supported`)
  }

  static toManyEntities = (configs: Config[]): Filter[] => {
    return configs.map(this.toEntity)
  }
}
