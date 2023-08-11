import { JSONSchemaType } from 'ajv'
import { ComponentDto, ComponentDtoSchema } from './ComponentDto'

export interface PageDto {
  path: string
  components: ComponentDto[]
  title?: string
}

export const PageDtoSchema: JSONSchemaType<PageDto> = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    title: { type: 'string', nullable: true },
    components: {
      type: 'array',
      items: ComponentDtoSchema,
    },
  },
  required: ['path', 'components'],
  additionalProperties: false,
}
