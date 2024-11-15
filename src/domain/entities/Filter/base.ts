import type { JSONSchema } from '@domain/services/SchemaValidator'

export type BaseFilterProps = {
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

export class BaseFilter {
  constructor(readonly field: string) {}

  toConfig(): BaseFilterProps {
    throw new Error('Method not implemented.')
  }
}
