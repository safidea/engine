import { JSONSchemaType } from 'ajv'
import { ContainerComponentOptions } from './ContainerComponentOptions'

export const ContainerComponentSchema: JSONSchemaType<ContainerComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['container'] },
    components: {
      type: 'array',
      items: {
        type: 'object',
        $ref: 'https://example.com/component.json',
        required: [],
      },
    },
  },
  required: ['type'],
  additionalProperties: false,
}
