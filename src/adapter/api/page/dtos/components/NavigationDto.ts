import { JSONSchemaType } from 'ajv'
import { LinkDto, LinkDtoSchema } from './LinkDto'
import { TitleComponentDto, TitleComponentDtoSchema } from './TitleComponentDto'
import { ComponentDto } from '../ComponentDto'

export interface NavigationDto {
  type: 'navigation'
  title: TitleComponentDto
  links: LinkDto[]
  components: ComponentDto[]
}

export const NavigationDtoSchema: JSONSchemaType<NavigationDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['navigation'] },
    title: TitleComponentDtoSchema,
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
