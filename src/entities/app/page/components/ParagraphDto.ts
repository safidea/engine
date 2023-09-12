import { JSONSchemaType } from 'ajv'

export interface ParagraphDto {
  type: 'paragraph'
  text: string
  size: 'sm' | 'md' | 'lg'
}

export const ParagraphDtoSchema: JSONSchemaType<ParagraphDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['paragraph'] },
    text: { type: 'string' },
    size: { type: 'string', enum: ['sm', 'md', 'lg'] },
  },
  required: ['type', 'text'],
  additionalProperties: false,
}
