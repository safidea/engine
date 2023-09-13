import { JSONSchemaType } from 'ajv'
import { BaseFieldOptions } from './BaseFieldOptions'

export const BaseFieldSchema: JSONSchemaType<BaseFieldOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    name: { type: 'string' },
    optional: { type: 'boolean', nullable: true },
    format: { type: 'string', nullable: true },
    default: { type: 'string', nullable: true },
    permissions: {
      type: 'object',
      properties: {
        update: {
          nullable: true,
          type: ['boolean', 'object'],
          oneOf: [
            {
              type: 'boolean',
            },
            {
              type: 'object',
              properties: {
                formula: { type: 'string' },
              },
              required: ['formula'],
            },
          ],
        },
      },
      nullable: true,
    },
  },
  required: ['name'],
  additionalProperties: false,
}
