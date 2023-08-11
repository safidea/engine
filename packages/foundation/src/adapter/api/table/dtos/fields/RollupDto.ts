import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface RollupDto extends BaseFieldDto {
  type: 'rollup'
  linkedRecords: string
  linkedField: string
  formula: string
}

export const RollupDtoSchema: JSONSchemaType<RollupDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['rollup'] },
    linkedRecords: { type: 'string' },
    linkedField: { type: 'string' },
    formula: { type: 'string' },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'linkedRecords', 'linkedField', 'formula'],
  additionalProperties: false,
}
