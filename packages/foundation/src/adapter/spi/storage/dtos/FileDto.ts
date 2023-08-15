import { JSONSchemaType } from 'ajv'

export interface FileDto {
  filename: string
  data: string
}

export const FileDtoSchema: JSONSchemaType<FileDto> = {
  type: 'object',
  properties: {
    filename: { type: 'string' },
    data: { type: 'string' },
  },
  required: ['filename', 'data'],
  additionalProperties: false,
}
