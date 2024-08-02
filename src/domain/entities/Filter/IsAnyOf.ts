import type { JSONSchema } from '@domain/services/SchemaValidator'
import { Base, type BaseParams, type BaseConfig } from './base'

export type Config = BaseConfig & {
  operator: 'isAnyOf'
  value: string[]
}

export type Params = BaseParams & {
  value: string[]
}

export const isAnyOfSchema: JSONSchema = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: { type: 'string', enum: ['isAnyOf'] },
    value: { type: 'array', items: { type: 'string' } },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
}

export class IsAnyOf extends Base {
  readonly value: string[]

  constructor(props: Params) {
    super(props)
    this.value = props.value
  }
}
