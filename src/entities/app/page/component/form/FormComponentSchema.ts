import { JSONSchemaType } from 'ajv'
import { FormComponentOptions } from './FormComponentOptions'
import { InputComponentSchema } from './input/InputComponentSchema'

export const FormComponentSchema: JSONSchemaType<FormComponentOptions> = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['form'] },
    table: { type: 'string' },
    inputs: {
      type: 'array',
      items: InputComponentSchema,
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
