import { JSONSchemaType } from 'ajv'
import { ComponentDto, ComponentDtoSchema } from '../ComponentDto'
import { LinkDto, LinkDtoSchema } from './LinkDto'
import { TitleDto, TitleDtoSchema } from './TitleDto'

export interface NavigationDto {
  type: 'navigation'
  title: TitleDto
  links: LinkDto[]
  components: ComponentDto[]
}

export const NavigationDtoSchema: JSONSchemaType<NavigationDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['navigation'] },
    title: TitleDtoSchema,
    links: {
      type: 'array',
      items: LinkDtoSchema,
    },
    components: {
      type: 'array',
      items: ComponentDtoSchema,
    },
  },
  required: ['type', 'title', 'links', 'components'],
  additionalProperties: false,
}
