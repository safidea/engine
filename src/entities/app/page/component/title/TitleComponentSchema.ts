import { JSONSchemaType } from 'ajv'
import { TitleComponentOptions } from './TitleComponentOptions'

export const TitleComponentSchema: JSONSchemaType<TitleComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['title'] },
    size: {
      type: 'string',
      enum: ['extra-small', 'small', 'medium', 'large', 'extra-large'],
      nullable: true,
    },
    text: { type: 'string' },
  },
  required: ['type', 'text'],
  additionalProperties: false,
}
