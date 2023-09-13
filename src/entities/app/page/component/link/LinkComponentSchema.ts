import { JSONSchemaType } from 'ajv'
import { LinkComponentOptions } from './LinkComponentOptions'

export const LinkComponentSchema: JSONSchemaType<LinkComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['link'] },
    path: { type: 'string' },
    label: { type: 'string' },
  },
  required: ['type', 'path', 'label'],
  additionalProperties: false,
}
