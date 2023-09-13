import { JSONSchemaType } from 'ajv'
import { LinkComponentSchema } from '../link/LinkComponentSchema'
import { TitleComponentSchema } from '../title/TitleComponentSchema'
import { NavigationComponentOptions } from './NavigationComponentOptions'

export const NavigationComponentSchema: JSONSchemaType<NavigationComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['navigation'] },
    title: TitleComponentSchema,
    links: {
      type: 'array',
      items: LinkComponentSchema,
    },
    components: {
      type: 'array',
      items: {
        type: 'object',
        $ref: 'https://example.com/component.json',
        required: [],
      },
    },
  },
  required: ['type', 'title', 'links', 'components'],
  additionalProperties: false,
}
