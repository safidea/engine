import { JSONSchemaType } from 'ajv'
import { PageOptions } from './PageOptions'
import { ComponentSchema } from './component/ComponentSchema'

export const PageSchema: JSONSchemaType<PageOptions> = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    title: { type: 'string', nullable: true },
    components: {
      type: 'array',
      items: ComponentSchema,
    },
  },
  required: ['path', 'components'],
  additionalProperties: false,
}
