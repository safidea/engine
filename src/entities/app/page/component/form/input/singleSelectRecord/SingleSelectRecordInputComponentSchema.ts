import { JSONSchemaType } from 'ajv'
import { BaseInputComponentSchema } from '../base/BaseInputComponentSchema'
import { SingleSelectRecordInputComponentOptions } from './SingleSelectRecordInputComponentOptions'

export const SingleSelectRecordInputComponentSchema: JSONSchemaType<SingleSelectRecordInputComponentOptions> =
  {
    type: 'object',
    properties: {
      ...BaseInputComponentSchema.properties,
      placeholder: { type: 'string', nullable: true },
      linkedLabelField: { type: 'string', nullable: true },
    },
    required: [...BaseInputComponentSchema.required],
    additionalProperties: false,
  }
