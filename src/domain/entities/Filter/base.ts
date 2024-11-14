import type { JSONSchema } from '@domain/services/SchemaValidator'

export type BaseProps = {
  field: string
}

export function buildFilterSchema(
  properties: JSONSchema['properties'],
  required: JSONSchema['required'] = []
): JSONSchema {
  return {
    type: 'object',
    properties: {
      field: { type: 'string' },
      ...properties,
    },
    required: ['field', ...required],
    additionalProperties: false,
  }
}

export class Base {
  constructor(readonly field: string) {}

  toConfig(): BaseProps {
    throw new Error('Method not implemented.')
  }
}
