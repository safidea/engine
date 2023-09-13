import { JSONSchemaType } from 'ajv'
import { ParagraphComponentOptions } from './ParagraphComponentOptions'

export const ParagraphComponentSchema: JSONSchemaType<ParagraphComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['paragraph'] },
    text: { type: 'string' },
    size: { type: 'string', enum: ['small', 'medium', 'large'] },
  },
  required: ['type', 'text'],
  additionalProperties: false,
}
