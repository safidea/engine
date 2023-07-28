import { JSONSchemaType } from '@application/utils/SchemaValidator'

export interface TitleDto {
  type: 'title'
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  text: string
}

export const TitleDtoSchema: JSONSchemaType<TitleDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['title'] },
    size: { type: 'string', enum: ['xs', 'sm', 'md', 'lg', 'xl'] },
    text: { type: 'string' },
  },
  required: ['type', 'size', 'text'],
  additionalProperties: false,
}
