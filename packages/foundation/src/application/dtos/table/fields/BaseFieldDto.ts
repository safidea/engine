import { Format } from '@domain/entities/table/fields/BaseField'
import { JSONSchemaType } from '@application/utils/SchemaValidator'

export interface BaseFieldDto {
  name: string
  optional?: boolean
  format?: Format
  default?: string
}

export const BaseFieldDtoSchema: JSONSchemaType<BaseFieldDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    optional: { type: 'boolean', nullable: true },
    format: { type: 'string', nullable: true },
    default: { type: 'string', nullable: true },
  },
  required: ['name'],
  additionalProperties: false,
}
