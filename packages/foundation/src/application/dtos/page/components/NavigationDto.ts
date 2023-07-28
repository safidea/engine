import { JSONSchemaType } from 'ajv'
import { LinkDto, LinkDtoSchema } from './LinkDto'
import { TitleDto, TitleDtoSchema } from './TitleDto'
import { ComponentDto } from '../ComponentDto'

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
