import { Format } from '@domain/entities/table/fields/BaseField'
import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'

export interface BaseFieldDto {
  name: string
  optional?: boolean
  format?: Format
  default?: string | number | boolean
  permissions?: {
    update?: boolean | { formula: string }
  }
}

export const BaseFieldDtoSchema: JSONSchemaType<BaseFieldDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    optional: { type: 'boolean', nullable: true },
    format: { type: 'string', nullable: true },
    default: { type: 'string', nullable: true },
    permissions: {
      type: 'object',
      properties: {
        update: {
          nullable: true,
          type: ['boolean', 'object'],
          oneOf: [
            {
              type: 'boolean',
            },
            {
              type: 'object',
              properties: {
                formula: { type: 'string' },
              },
              required: ['formula'],
            },
          ],
        },
      },
      nullable: true,
    },
  },
  required: ['name'],
  additionalProperties: false,
}
