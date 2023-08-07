import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { InputDto, InputDtoSchema } from './InputDto'

export interface FormDto {
  type: 'form'
  table: string
  inputs: InputDto[]
  recordIdToUpdate?: string
  submit: {
    label?: string
    autosave?: boolean
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
    recordIdToUpdate: { type: 'string', nullable: true },
    submit: {
      type: 'object',
      properties: {
        label: { type: 'string', nullable: true },
        autosave: { type: 'boolean', nullable: true },
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
      required: ['loadingLabel'],
      additionalProperties: false,
    },
  },
  required: ['type', 'table', 'inputs', 'submit'],
  additionalProperties: false,
}
