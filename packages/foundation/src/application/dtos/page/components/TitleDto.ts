import { JSONSchemaType } from '@application/utils/SchemaValidator'

export interface TitleDto {
  type: 'title'
  text: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const TitleDtoSchema: JSONSchemaType<TitleDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['title'] },
    size: { type: 'string', enum: ['xs', 'sm', 'md', 'lg', 'xl'], nullable: true },
    text: { type: 'string' },
  },
  required: ['type', 'text'],
  additionalProperties: false,
}
