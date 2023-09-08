import { JSONSchemaType } from 'ajv'
import { Size } from '@domain/entities/page/components/TitleComponent'

export interface TitleComponentDto {
  type: 'title'
  text: string
  size?: Size
}

export const TitleComponentDtoSchema: JSONSchemaType<TitleComponentDto> = {
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
