import { JSONSchemaType } from 'ajv'
import { ComponentDto } from '../ComponentDto'

export interface ContainerComponentDto {
  type: 'container'
  components: ComponentDto[]
}

export const ContainerComponentDtoSchema: JSONSchemaType<ContainerComponentDto> = {
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
