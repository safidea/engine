import type { JSONSchema } from '@domain/services/SchemaValidator'
import { Base, type BaseParams, type BaseConfig } from './base'

export type Config = BaseConfig & {
  operator: 'is'
  value: string | number
}

export type Params = BaseParams & {
  value: string | number
}

export const isSchema: JSONSchema = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: { type: 'string', enum: ['is'] },
    value: { type: 'string' },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
}

export class Is extends Base {
  readonly value: string | number

  constructor(props: Params) {
    super(props)
    this.value = props.value
  }
}
