import { JSONSchemaType } from '@adapter/api/utils/AjvUtils'
import { BaseFieldDto, BaseFieldDtoSchema } from './BaseFieldDto'

export interface SingleSelectDto extends BaseFieldDto {
  type: 'single_select'
  options: string[]
}

export const SingleSelectDtoSchema: JSONSchemaType<SingleSelectDto> = {
  type: 'object',
  properties: {
    ...BaseFieldDtoSchema.properties,
    type: { type: 'string', enum: ['single_select'] },
    options: { type: 'array', items: { type: 'string' } },
  },
  required: [...BaseFieldDtoSchema.required, 'type', 'options'],
  additionalProperties: false,
}
