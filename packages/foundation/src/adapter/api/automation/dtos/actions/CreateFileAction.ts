import {
  CreateFileActionInput,
  CreateFileActionOutput,
} from '@domain/entities/automation/actions/CreateFileAction'
import { JSONSchemaType } from 'ajv'

export interface CreateFileActionDto {
  type: 'create_file'
  filename: string
  input: CreateFileActionInput
  output: CreateFileActionOutput
  template: string
}

export const CreateFileActionDtoSchema: JSONSchemaType<CreateFileActionDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['create_file'] },
    filename: { type: 'string' },
    input: { type: 'string', enum: ['html'] },
    output: { type: 'string', enum: ['pdf'] },
    template: { type: 'string' },
  },
  required: ['type', 'filename', 'input', 'output', 'template'],
}
