import { JSONSchemaType } from '@adapter/api/app/AppUtils'
import { BaseInputDto, BaseInputDtoSchema } from './BaseInputDto'

export interface TableInputDto extends BaseInputDto {
  columns: {
    label: string
    field: string
    placeholder?: string
  }[]
  addLabel?: string
}

export const TableDtoSchema: JSONSchemaType<TableInputDto> = {
  type: 'object',
  properties: {
    ...BaseInputDtoSchema.properties,
    columns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          field: { type: 'string' },
          placeholder: { type: 'string' },
        },
        required: ['label'],
        additionalProperties: false,
      },
    },
    addLabel: { type: 'string' },
  },
  required: [...BaseInputDtoSchema.required, 'columns'],
  additionalProperties: false,
}
