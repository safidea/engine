import { JSONSchemaType } from '@application/utils/SchemaValidator'

export interface LinkDto {
  type: 'link'
  path: string
  label: string
}

export const LinkDtoSchema: JSONSchemaType<LinkDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['link'] },
    path: { type: 'string' },
    label: { type: 'string' },
  },
  required: ['type', 'path', 'label'],
  additionalProperties: false,
}
