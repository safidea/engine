import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { InputDto, InputDtoSchema } from './InputDto'

export interface FormDto {
  type: 'form'
  table: string
  inputs: InputDto[]
  submit: {
    label: string
    loadingLabel: string
    actionsOnSuccess?: {
      type: string
      path: string
    }[]
  }
}

export const FormDtoSchema: JSONSchemaType<FormDto> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['form'] },
    table: { type: 'string' },
    inputs: {
      type: 'array',
      items: InputDtoSchema,
    },
    submit: {
      type: 'object',
      properties: {
        label: { type: 'string' },
        loadingLabel: { type: 'string' },
        actionsOnSuccess: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              path: { type: 'string' },
            },
            required: ['type', 'path'],
            additionalProperties: false,
          },
          nullable: true,
        },
      },
      required: ['label', 'loadingLabel'],
      additionalProperties: false,
    },
  },
  required: ['type', 'table', 'inputs', 'submit'],
  additionalProperties: false,
}
