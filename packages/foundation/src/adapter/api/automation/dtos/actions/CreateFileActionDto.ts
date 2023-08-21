import {
  CreateFileActionData,
  CreateFileActionInput,
  CreateFileActionOutput,
  CreateFileActionTemplate,
} from '@domain/entities/automation/actions/CreateFileAction'
import { JSONSchemaType } from 'ajv'

export interface CreateFileActionDto {
  type: 'create_file'
  filename: string
  input: CreateFileActionInput
  output: CreateFileActionOutput
  template: CreateFileActionTemplate
  bucket: string
  data?: CreateFileActionData
}

export const CreateFileActionDtoSchema: JSONSchemaType<CreateFileActionDto> = {
  type: 'object',
  properties: {
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
            privatePath: { type: 'string' },
          },
          required: ['privatePath'],
          additionalProperties: false,
        },
      ],
    },
    bucket: { type: 'string' },
    data: {
      type: 'object',
      additionalProperties: { type: 'string' },
      required: [],
      nullable: true,
    },
  },
  required: ['type', 'filename', 'input', 'output', 'template', 'bucket'],
}
