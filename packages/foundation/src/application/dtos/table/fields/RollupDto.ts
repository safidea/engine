import { JSONSchemaType } from '@application/utils/SchemaValidator'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface RollupDto extends BaseFieldDto {
  type: 'rollup'
  linked_records: string
  linked_field: string
  formula: string
}

export const RollupDtoSchema: JSONSchemaType<RollupDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['rollup'] },
    linked_records: { type: 'string' },
    linked_field: { type: 'string' },
    formula: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'linked_records', 'linked_field', 'formula'],
  additionalProperties: false,
}
