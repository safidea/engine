import { JSONSchemaType } from 'ajv'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface RollupFieldDto extends BaseFieldDto {
  type: 'rollup'
  linkedRecords: string
  linkedField: string
  formula: string
}

export const RollupDtoSchema: JSONSchemaType<RollupFieldDto> = {
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
