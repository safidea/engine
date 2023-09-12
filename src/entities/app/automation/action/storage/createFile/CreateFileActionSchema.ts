import { JSONSchemaType } from 'ajv'
import { CreateFileActionOptions } from './CreateFileActionOptions'

export const CreateFileActionSchema: JSONSchemaType<CreateFileActionOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    type: { type: 'string', enum: ['create_file'] },
    filename: { type: 'string' },
    input: { type: 'string', enum: ['html'] },
    output: { type: 'string', enum: ['pdf'] },
    template: {
      oneOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {
            path: { type: 'string' },
          },
          required: ['path'],
          additionalProperties: false,
        },
      ],
    },
    bucket: { type: 'string' },
    data: {
      type: 'object',
      additionalProperties: { type: 'string' },
      required: [],
    },
  },
  required: ['name', 'type', 'filename', 'input', 'output', 'template', 'bucket'],
}
