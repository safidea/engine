import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { ComponentDto, ComponentDtoSchema } from './ComponentDto'

export interface PageDto {
  path: string
  title?: string
  components?: ComponentDto[]
}

export const PageDtoSchema: JSONSchemaType<PageDto> = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    title: { type: 'string', nullable: true },
    components: {
      type: 'array',
      items: ComponentDtoSchema,
      nullable: true,
    },
  },
  required: ['path'],
  additionalProperties: false,
}
